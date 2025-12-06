import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom console log format
const consoleFormat = printf(({ level, message, timestamp }) => {
    return `[${level}]: (${timestamp}) ${message}`;
});

// Console transport (development)
const consoleTransport = new winston.transports.Console({
    format: combine(colorize(), timestamp(), consoleFormat),
});

const logger = winston.createLogger({
    level: "info",
    transports: [consoleTransport],
});

export default logger;
