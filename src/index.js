import Server from "./server";

const { PORT, NODE_ENV, TELEGRAM_TOKEN } = process.env;

const server = new Server(PORT || "8080", NODE_ENV || "development");

server.start();
