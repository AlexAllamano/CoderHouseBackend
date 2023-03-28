import express from "express";
import handlebars from "express-handlebars";
import productoRoute from "./routes/productos.route.js";
import cartRoute from "./routes/carts.route.js";
import viewsRoute from "./routes/views.route.js";
import fileDirName from "./utils/fileDirName.js";
import configureSocket from "./socket/configure-socket.js";
import mongoose from "mongoose";
import config from "./data.js";

const { __dirname } = fileDirName(import.meta);
const app = express();
const { PORT, MONGO_URL } = config;

// MIDDLEWARES

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ARCHIVOS ESTÁTICOS

app.use("/static", express.static(__dirname + "/public"));

// ROUTES

app.use("/", viewsRoute);
app.use("/api/product", productoRoute);
app.use("/api/cart", cartRoute);

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
  res.status(500).send({ error });
});