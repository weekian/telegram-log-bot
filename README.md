# telegram-log-bot

[![Known Vulnerabilities](https://snyk.io/test/github/weekian/telegram-log-bot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/weekian/telegram-log-bot?targetFile=package.json)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Telegram bot for logging daily work done

## Setup

First install the dependencies

```bash
npm install
```

Pull the postgres docker image

```bash
npm run docker-pull-postgres
```

Run postgres docker container

```bash
npm run docker-run-postgres
```

Create a .env file in the project root folder with the following for local development:

```text
TELEGRAM_TOKEN=<token from https://t.me/BotFather>
PORT=<port>
DATABASE_URL=<postgres URL e.g. postgres://postgres:docker@localhost:5432/postgres for docker>
TZ=<default timezone for bot to display time e.g. Asia/Singapore>
NODE_ENV=development
```

## Running Locally

```bash
npm run dev
```

To run the telegram bot locally and connected to the postgres docker container

## Testing

Run the following command to execute the unit tests

```bash
npm run test
```

## Deployment

## Good To Have

1. Redis for caching
2. Docker secrets
3. Coveralls

## To Do

1. Rename GroupChat.js in db/models to groupChat
2. Handle deletion from groups
3. Handle group chats where bot is the only member left
4. Implement rest of bot commands
