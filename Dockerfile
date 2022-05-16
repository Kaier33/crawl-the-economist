FROM node:16.15.0-alpine as build

ADD . /crawl-the-economist
WORKDIR /crawl-the-economist
RUN npm install --registry=https://registry.npm.taobao.org

FROM node:16.15.0-alpine
COPY --from=build /crawl-the-economist /crawl-the-economist
WORKDIR /crawl-the-economist
CMD ["npm", "start"]