FROM node:16.15.0-alpine

WORKDIR /crawl-the-economist

COPY package*.json /crawl-the-economist

RUN npm install --registry=https://registry.npmmirror.com

COPY . /crawl-the-economist

CMD ["npm", "start"]