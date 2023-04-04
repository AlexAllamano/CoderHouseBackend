import { Router } from "express";
import manager from "../dao/productos.manager.js";
import { socketServer } from "../socket/configure-socket.js";

const route = Router();

//obtengo todos los productos, limitado, filtrados y/o ordenados
route.get("", async (req, res, next) => {
  try {
    const limite = req.query.limit ?? 5;
    const page = req.query.page ?? 1;
    const sort = req.query.sort ?? -1;
    const query = req.body ?? {};

    const products = await manager.getAll(limite, page, sort, query);
    console.log(products);

    

    res.status(200).send({
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage
    });
    // res.status(200).send('fin')
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//obtengo un solo producto por id
route.get("/:pid", async (req, res, next) => {
  try {
    let pid = req.params.pid;
    const product = await manager.getById(pid);
    res.status(200).send({ product: product });
  } catch (e) {
    next(e);
  }
});

//agrego un producto a la DB
route.post("", async (req, res, next) => {
  try {
    let bandera = false;
    const producto = req.body;
    let productos = await manager.getAll();

    productos.forEach((item) => {
      if (producto.code === item.code) {
        bandera = true;
      }
    });
    console.log(bandera);
    if (bandera) {
      res
        .status(200)
        .send({ Error: "Ya existe un producto con ese code registrado" });
    } else {
      let newPorducto = await manager.save(producto);

      productos = await manager.getAll();
      console.log(newPorducto);

      console.log(productos);
      socketServer.emit("mensajePost", productos);
      res.status(200).send({ producto: newPorducto });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//borro un producto por id
route.delete("/:pid", async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let result = await manager.delete(pid);
    socketServer.emit("mensajeDelete", await manager.getAll());
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//modifico un producto por id
route.put("/:pid", async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let productToReplace = req.body;
    let result = await manager.update(pid, productToReplace);
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

export default route;
