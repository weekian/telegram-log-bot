import { createLogger, format, transports } from "winston";

const { combine, timestamp: winstonTimestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = (env) => {
    let level;
    if (env === "production") {
        level = "info";
    } else if (env === "test") {
        level = "error";
    } else {
        level = "debug";
    }

    return createLogger({
        level,
        transports: [new transports.Console()],
        format: combine(winstonTimestamp(), myFormat),
    });
};

export default logger;
