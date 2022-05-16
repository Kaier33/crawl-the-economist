const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp(".env");
dotenv.config({path: `${pathsDotenv}.mine`})
dotenv.config({path: `${pathsDotenv}`});

module.exports = {
  ORIGINAL_URL: process.env.ORIGINAL_URL,    // 源站. 由于不可描述的原因, 正常访问很慢.
  CRAWLING_URL: process.env.CRAWLING_URL,    // 镜像站. 墙内加速访问
  SMTP_CODE: process.env.SMTP_CODE,          // 记得去邮箱中开启, 和获取SMTP码
  SENDER: process.env.SENDER,                // 邮件发送者
  RECEIVER: process.env.RECEIVER,            // 邮件接受者
  EMAIL_SUBJECT: process.env.EMAIL_SUBJECT,  // 邮件标题
  EMAIL_CONTENT: process.env.EMAIL_CONTENT   // 邮件文本内容
}