FROM node:10.15.1-alpine

WORKDIR /var/www/telegram-log-bot

# FIXME: Replace with Docker secrets (only applicable for local development as Heroku has var config)
ENV TELEGRAM_TOKEN=

# FIXME: Remove devDependencies from being copied into docker image
COPY . .

CMD [ "npm", "start" ]