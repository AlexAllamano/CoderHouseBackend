import { Router } from "express";
import ProductManager from "./../manager/ProductoManager.js";
import { socketServer } from "../socket/configure-socket.js";
let productManager = new ProductManager("src/database/productos.json");

const route = Router();

route.get("", async (req, res) => {
  const limite = req.query.limit;

  res.send(await productManager.getProducts(limite));
});

route.get("/:pid", async (req, res) => {
  res.send(await productManager.getProductsById(parseInt(req.params.pid)));
});

route.post("", async (req, res) => {
  const producto = req.body;
  const products = await productManager.getProducts();
  await productManager.addProducts(
    producto.title,
    producto.description,
    producto.price,
    producto.thumbnail,
    producto.code,
    producto.stock,
    producto.status
  );
  socketServer.emit("mensajePost", products);

  res.send();
});

route.delete("/:pid", async (req, res) => {
  await productManager.deleteProduct(parseInt(req.params.pid));
  const products = await productManager.getProducts();
  socketServer.emit("mensajeDelete", products);
  res.send();
});

route.put("/:pid", async (req, res) => {
  const producto = req.body;

  res.send(await productManager.updateProduct(req.params.pid, producto));
});
export default route;
