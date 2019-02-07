FROM node:10.15.1-alpine

WORKDIR /var/www/telegram-log-bot

COPY . .

RUN npm install

CMD [ "npm", "start" ]