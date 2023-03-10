import { Router } from "express";
import ProductManager from "./../manager/ProductoManager.js";
import { socketServer } from "../socket/configure-socket.js";

let productManager = new ProductManager("src/database/productos.json");

const route = Router();

route.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("home", { title: "Home", products });
});

route.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { title: "RealTimeProducts", products });
});

export default route;
