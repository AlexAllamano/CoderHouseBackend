import express from "express";
import handlebars from "express-handlebars";
import route from './routes/index.js'
import fileDirName from "./utils/fileDirName.js";
import configureSocket from "./socket/configure-socket.js";
import mongoose from "mongoose";
import config from "./data.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { configurePassport } from "./config/passport.config.js";
import passport from "passport";


const { __dirname } = fileDirName(import.meta);
const app = express();
const { PORT, MONGO_URL } = config;


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

const auth = (req, res, next) => {
  const admin = req.session.admin;

  if (admin) {
    next();
  } else {
    res.status(401).send({ error: "No autorizado" });
  }
};

//ARCHIVOS ESTÁTICOS

app.use("/static", express.static(__dirname + "/public"));

// ROUTES

app.use("/api", route);


app.get("/setCookie", (req, res) => {
  res
    .cookie("prueba", "Primera Cookie", { maxAge: 10000, signed: true })
    .send("Cookie creada");
});

app.get("/getCookie", (req, res) => {
  const cookies = req.cookies;
  const signedCookies = req.signedCookies;
  console.log(cookies, signedCookies);

  res.send([cookies, signedCookies]);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("prueba").send("se borró la cookie");
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

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username !== "admin" || password !== "admin") {
    res.status(401).send({ error: "Usuario o contraseña incorrecta" });
    return;
  }
  req.session.user = username;
  req.session.admin = true;
  res.send({ login: "logueado" });
});

app.get("/autorizado", auth, (req, res) => {
  res.send({ autorizado: "ok, autorizado" });
});

// HANDLEBARS

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// MONGOOSE

const conection = mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//WEBSOCKET
const httpServer = app.listen(PORT, () => {
  console.log("Escuchando server");
});

configureSocket(httpServer);

app.use((error, req, res, next) => {
  if (error.mesagge) {
    return res.status(400).send({
      message: error.mesagge,
    });
  }

  console.log('Ocurrio un error', error)
  res.status(500).send({ error: error });
});
