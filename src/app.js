import express from "express";
import productoRoute from "./routes/productos.routes.js";
import cartRoute from "./routes/carts.routes.js";
import { fileDirName } from "./utils/fileDirName.js";
const { __dirname } = fileDirName(import.meta);

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));

app.use("/api/product", productoRoute);
app.use("/api/cart", cartRoute);

app.listen(port, () => {
  console.log("Escuchando server");
});
