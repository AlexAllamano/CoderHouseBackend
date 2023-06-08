import winston from "winston";
import data from "../../data.js";

const niveles = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const loggerDesarrollo = winston.createLogger({
  levels: niveles,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const loggerProduccion = winston.createLogger({
  levels: niveles,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "./errors.log", level: "error" }),
    new winston.transports.File({ filename: "./logfile.log", level: "info" }),
  ],
});

let logger;

if (data.ENTORNO === "produccion") {
  logger = loggerProduccion;
} else {
  logger = loggerDesarrollo;
}

export default logger;
