## 定时爬取 「经济学人」 并发送到邮箱, 方便自己用kindle浏览

1. `.env`文件记得填写自己的邮件(发件/接收人),以及最重要的`SMTP_CODE`(在邮箱中获取)
  1.1. `SENDER`发件人目前仅支持 `QQ邮箱` 和 `网易邮箱`  
  1.2. `EMAIL_SUBJECT`为邮件标题, `EMAIL_CONTENT`为邮件正文
2. 优先用 github 镜像站, 当然, 不排除其挂掉的可能. XD
3. 每周一早上9点开始爬虫任务. 默认爬取的是`.mobi`, 可在`.env`自行更改`FILETYPE` 为 `pdf | epub | mobi `


## todo:
1. 任务时间自定
2. pm2