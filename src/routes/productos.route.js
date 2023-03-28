import { Router } from "express";
import manager from "../dao/productos.manager.js";
import { socketServer } from "../socket/configure-socket.js";

const route = Router();

route.get("", async (req, res, next) => {
  try {
    const products = await manager.getAll();
    res.status(200).send({ products: products });
  } catch (e) {
    next(e);
  }
});

route.get("/:pid", async (req, res, next) => {
  try {

    let pid = req.params.pid;
    const product = await manager.getById(pid);
    res.status(200).send({ product: product });
  } catch (e) {
    next(e);
  }
});

route.post("", async (req, res, next) => {
  try {
    const producto = req.body;
    let newPorducto = await manager.save(producto);
    const productos = await manager.getAll();
    socketServer.emit("mensajePost", productos);
    res.status(200).send({ producto: newPorducto });
  } catch (e) {
    next(e);
  }
});

route.delete("/:pid", async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let result = await manager.delete(pid)
    socketServer.emit("mensajeDelete", await manager.getAll());
    res.status(200).send(result);
  } catch (e) {
    
    console.log(e)
    next(e);
  }
});

route.put("/:pid", async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let productToReplace = req.body;
    let result = await manager.update(pid, productToReplace)
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

export default route;
