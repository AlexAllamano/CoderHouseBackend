import { Router } from "express";
import productoManager from "../dao/productos.manager.js";
import carritoManager from "../dao/carts.manager.js";

const route = Router();

route.get("/", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("home", { title: "Home", products });
});

route.get("/realtimeproducts", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("realTimeProducts", { title: "RealTimeProducts", products });
});

route.get("/products", async (req, res) => {
  const query = req.query;

  const products = await productoManager.getAll(
    query.limite,
    query.page,
    query.sort,
    query.query
  );

  if (query.page > products.totalPages || query.page <= 0 ) {
    res.render("noEncontrado", {
      title: "Página no encontrada",
      mensaje: `La página ingresada no existe para el límite asignado`,
    });
  } else if (query.limite > products.totalDocs || query.limite <= 0) {
    res.render("noEncontrado", {
      title: "Página no encontrada",
      mensaje: `Está intenando mostrar un número superior o inferior a la cantidad de documentos disponibles`,
    });
  } else {
    res.render("products", {
      title: "Productos",
      products: products.docs,
      paginas: products.totalPages,
      pagina: products.page,
      tienePrev: products.hasPrevPage,
      tieneNext: products.hasNextPage,
      prev: products.prevPage,
      next: products.nextPage,
    });
  }
});

route.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;

  let carrito = await carritoManager.getById(cid);

  if (carrito.Error) {
    res.render("noEncontrado", {
      title: "Carrito no encontrado",
      mensaje: `El carrito con el id ${cid} no existe`,
    });
  } else {
    res.render("carritos", {
      title: "Carrito",
      cid: cid,
      productos: carrito.products,
    });
  }
});

route.get("/chat", async (req, res) => {
  const products = await productoManager.getAll();

  res.render("chat", {});
});

export default route;
