## 定时爬取 「经济学人」 并发送到邮箱, 方便自己用kindle浏览

1. `.env`文件记得填写自己的邮件(发件/接收人),以及最重要的`SMTP_CODE`(在邮箱中获取)  
  1.1. `SENDER`发件人目前仅支持 `QQ邮箱` 和 `网易邮箱`  
  1.2. `EMAIL_SUBJECT`为邮件标题, `EMAIL_CONTENT`为邮件正文
2. 优先用 github 镜像站, 当然, 不排除其挂掉的可能. XD
3. 每周六早上8点(可自行更改时间, 目标仓库是每周五晚上更新)开始爬虫任务. 默认爬取的是`.epub`, 可在`.env`自行更改`FILETYPE` 为 `pdf | epub | mobi `

### Docker

1. 创建`.env`文件, 根据实际情况填入以下内容

```
FILETYPE="epub"
REPOSITORY="/hehonghui/awesome-english-ebooks/tree/master/01_economist"
EMAIL_SUBJECT="The Economist"
EMAIL_CONTENT="The Economist epub file"
SCHEDULE='{"hour": 8, "minute": 0, "dayOfWeek": 6}'

SMTP_CODE="这里填你的SMTP_CODE"
SENDER="发件人邮箱 (请填写 QQ邮箱 或者 163邮箱)"
RECEIVER="接收人的邮箱"
```  

2. 拉取镜像  
`docker pull kaier33/craw-the-economist-ebooks:v1.05`

3. 启动  
`docker run -d --restart=always -e TZ=Asia/Shanghai -v $PWD/.env:/crawl-the-economist/.env kaier33/craw-the-economist-ebooks:v1.05`

### Reference
[awesome-english-ebooks](https://github.com/hehonghui/awesome-english-ebooks)
