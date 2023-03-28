import { Router } from "express";
import productoManager from "../dao/productos.manager.js";

const route = Router();

route.get("/", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("home", { title: "Home", products });
});

route.get("/realtimeproducts", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("realTimeProducts", { title: "RealTimeProducts", products });
});

route.get("/chat", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("chat", {});
});

export default route;
