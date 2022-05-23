const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp(".env");
dotenv.config({path: `${pathsDotenv}.mine`})
dotenv.config({path: `${pathsDotenv}`});

module.exports = {
  FILETYPE: process.env.FILETYPE,            // 要下载的文件类型 epub || pdf || mobi (默认)
  REPOSITORY: process.env.REPOSITORY,        // 仓库地址不包括host
  SMTP_CODE: process.env.SMTP_CODE,          // 记得去邮箱中开启, 和获取SMTP码
  SENDER: process.env.SENDER,                // 邮件发送者
  RECEIVER: process.env.RECEIVER,            // 邮件接受者
  EMAIL_SUBJECT: process.env.EMAIL_SUBJECT,  // 邮件标题
  EMAIL_CONTENT: process.env.EMAIL_CONTENT,   // 邮件文本内容
  SCHEDULE: process.env.SCHEDULE,             // 每周定时任务执行时间 {hour: 9, minute: 0, dayOfWeek: 1}
}