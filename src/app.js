import express from "express";
import handlebars from "express-handlebars";
import route from "./routes/index.js";
import webRoute from "./routes/webIndwx.js";
import fileDirName from "./utils/fileDirName.js";
import configureSocket from "./socket/configure-socket.js";
import mongoose from "mongoose";
import config from "./data.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { configurePassport } from "./config/passport.config.js";
import passport from "passport";
import compression from "express-compression";
import errorMiddleware from "./classes/errors/error.middleware.js";
import MockingService from "./classes/mocks/moks.js";
import logger from "./classes/logs/winston-logger.js";
import spec from "./docs/swagger-options.js";
import swaggerUi from "swagger-ui-express";
import EventEmmitter from "events";

const { __dirname } = fileDirName(import.meta);
const app = express();
const { PORT, MONGO_URL } = config;
process.setMaxListeners(0);

// MIDDLEWARES

app.use(cookieParser("secreto"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15000,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ARCHIVOS ESTÁTICOS

app.use(
  "/api/carts/static",
  express.static(__dirname + "/public", { type: "application/javascript" })
);
app.use(
  "/api/static",
  express.static(__dirname + "/public", { type: "application/javascript" })
);
app.use(
  "/static",
  express.static(__dirname + "/public", { type: "application/javascript" })
);

// ROUTES

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.use("/api", route);
app.use("/", webRoute);

app.get("/mockingProducts", (req, res, next) => {
  try {
    {
      const mokingService = new MockingService();
      const productos = Array.from({ length: 100 }, () =>
        mokingService.generarProducto()
      );
      res.status(200).send({ productos });
    }
  } catch (error) {
    logger.error(error);
  }
});

app.get("/loggerTest", (req, res, next) => {
  try {
    logger.debug("Esto es un debug");
    logger.http("Esto es un http");
    logger.info("Esto es un info");
    logger.warning("Esto es un warn");
    logger.error("Esto es un error");
    logger.fatal("Esto es un fatal");

    res.status(200).send("Logs enviados");
  } catch (error) {
    logger.error(error);
  }
});

app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send({ counter: req.session.counter });
  } else {
    req.session.counter = 1;
    res.send({ counter: req.session.counter, primeraVez: true });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send("Logout ok");
    } else {
      res.send({ status: "Logout Error", body: err });
    }
  });
});

// HANDLEBARS

const hbs = handlebars.create({
  helpers: {
    gt: function (value) {
      return value > 0;
    },
    verificarAdmin: function (value) {
      return value.toLowerCase() == "admin";
    },
    verificarPremium: function (role, idUsuario, productOwnerId) {
      if (role.toLowerCase() == "admin") {
        return false;
      }
      return idUsuario == productOwnerId;
    },
    noEsAdmin: function (role) {
      return role.toLowerCase() !== "admin";
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// MONGOOSE

const conection = mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//WEBSOCKET
const httpServer = app.listen(PORT, () => {
  logger.info("Escuchando server");
});

configureSocket(httpServer);

app.use(compression());

app.use(errorMiddleware);
