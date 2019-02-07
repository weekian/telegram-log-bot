FROM node:10.15.1-alpine

WORKDIR /var/www/telegram-log-bot

EXPOSE 80

ENV TELEGRAM_TOKEN=

ENV PORT=80 

COPY . .

RUN npm install

CMD [ "npm", "start" ]