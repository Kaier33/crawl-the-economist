const CONFIG = require("./config");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const got = require('got');
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
const ping = require("ping");

if (!CONFIG.SMTP_CODE || !CONFIG.SENDER || !CONFIG.RECEIVER) {
  throw Error('.env文件内容没有填写完整!')
}
if (!(CONFIG.SENDER.includes('@qq.com') || CONFIG.SENDER.includes('@163.com'))) {
  throw Error('发件人仅支持 QQ邮箱 和 网易邮箱')
}

function sendMail(fileName) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: CONFIG.SENDER.includes('@qq.com') ? 'smtp.qq.com' : 'smtp.163.com',
      port: 587,
      secure: false,
      auth: {
        user: CONFIG.SENDER,
        pass: CONFIG.SMTP_CODE
      }
    })
    let mailOpt = {
      from: CONFIG.SENDER,
      to: CONFIG.RECEIVER,
      subject: CONFIG.EMAIL_SUBJECT,
      text: CONFIG.EMAIL_CONTENT,
      attachments: [{
        filename: fileName,
        path: path.join(__dirname, `./download/${fileName}`)
      }]
    }
    transporter.sendMail(mailOpt, (err) => {
      if (err) reject(err)
      console.log(`${new Date().toLocaleString()} 邮件发送完毕`)
      resolve(true)
    })
  })
}

function getFileByUrl(url, fileName) {
  return new Promise((resolve, reject) => {
    try {
      fs.access(path.join(__dirname, `./download/${fileName}`), fs.constants.F_OK, (none) => {
        if (!none) {
          fs.unlinkSync(path.join(__dirname, `./download/${fileName}`))
        }
      })
      got.stream(url)
        .pipe(fs.createWriteStream(path.join(__dirname, `./download/${fileName}`)))
        .on('close', function(err) {
          if (err) reject(err)
          console.log(`${new Date().toLocaleString()} 文件下载完毕`)
          resolve('ok')
        })
    } catch (error) {
      reject(error)
    }
  })
}

async function findOptimalHost() {
  return new Promise(async (resovle) => {
    try {
      const hosts = ['github.com', 'hub.xn--gzu630h.xn--kpry57d', 'kgithub.com']
      const optimalList = []
      for(let host of hosts){
        let res = await ping.promise.probe(host);
        if (res.alive) {
          optimalList.push({host: host, time: res.time})
        }
      }
      optimalList.sort((a ,b) => {
        if (a.time < b.time) return -1
        if (a.time > b.time) return 1
        return 0
      })
      resovle(optimalList[0]['host'])
    } catch (error) {
      resovle('github.com')
    }
  })
}

async function crawling() {
  try {
    let host = 'github.com'
    host = await findOptimalHost();
    console.log("------------crawling------------");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://${host}${CONFIG.REPOSITORY}`);
    await page.waitForSelector('.Details-content--hidden-not-important.js-navigation-container.js-active-navigation-container');
    const lastDate =  await page.evaluate(async() => {
      const listSelector = '.Box-row.position-relative.js-navigation-item';
      const listDom = document.querySelectorAll(listSelector)
      return listDom[listDom.length - 3].children[1].firstElementChild.firstElementChild.innerText
    })
    if (lastDate) {
      let fmt_date = lastDate.replace(/te_/ig, '').replace(/\./ig, '/')
      const allWeekSeconds = 60 * 60 * 24 * 7 * 1000;
      if (new Date().getTime() - new Date(fmt_date).getTime() <= allWeekSeconds) {
        const link = await page.$(`a[title='${lastDate}']`);
        await link.click();
        await page.waitForTimeout(2000);
        const page2 = (await browser.pages())[1];
        const page2_data = await page2.evaluate(async() => {
          return {
            fileName: document.querySelectorAll('.position-relative.js-navigation-item')[2].children[1].firstElementChild.firstElementChild.title,
            url: location.href
          }
        })
        console.log('page2_data::', page2_data);
        const downloadUrl = page2_data.url.replace('/tree/', '/raw/') + `/${page2_data.fileName}`;
        console.log('download start', downloadUrl)
        await getFileByUrl(downloadUrl, page2_data.fileName);
        await page.waitForTimeout(2000);
        await sendMail(page2_data.fileName);
      }
    }
    await page.close();
  } catch (error) {
    console.log("err:", error);
  }
}

schedule.scheduleJob({hour: 9, minute: 0, dayOfWeek: 1}, function() {
  crawling();
})
