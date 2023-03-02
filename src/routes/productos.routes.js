import { Router } from "express";
import ProductManager from "./../manager/ProductoManager.js";
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

  res.send(
    await productManager.addProducts(
      producto.title,
      producto.description,
      producto.price,
      producto.thumbnail,
      producto.code,
      producto.stock,
      producto.status
    )
  );
});

route.delete("/:pid", async(req, res) =>{
    res.send(await productManager.deleteProduct(parseInt(req.params.pid)));
})

route.put("/:pid", async(req, res)=>{
  const producto = req.body;

  res.send(
    await productManager.updateProduct(req.params.pid, producto)
  );
})
export default route;
