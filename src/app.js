import express from "express";
import productoRoute from "./routes/productos.routes.js";
import cartRoute from "./routes/carts.routes.js";
import viewsRoute from "./routes/views.routes.js";
import fileDirName from "./utils/fileDirName.js";
import { uploader } from "./utils/uploader.js";
import handlebars from "express-handlebars";
import configureSocket from "./socket/configure-socket.js";
const { __dirname } = fileDirName(import.meta);






//EXPRESS
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



//ARCHIVOS ESTÁTICOS
app.use("/static", express.static(__dirname + "/public"));


//ROUTES 
app.use("/", viewsRoute)
app.use("/api/product", productoRoute);
app.use("/api/cart", cartRoute);

//MULTER
app.post("/file", uploader.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo guardar la imagen" });
  }
  console.log(req.file);
  res.send({ file: req.file });
});


//WEBSOCKET
const httpServer = app.listen(port, () => {
  console.log("Escuchando server");
});

configureSocket(httpServer);

