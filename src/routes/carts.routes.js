import { Router } from "express";
import CartManager from "../manager/CartManager.js";
let cartManager = new CartManager("src/database/carritos.json");

const route = Router();

route.post('', async (req, res) => {
  res.send(await cartManager.addCart());
});

route.get('/:cid', async (req, res) => {
      res.send(await cartManager.getCartById(req.params.cid));
    });

route.post("/:cid/product/:pid", async (req, res) => {
  
  res.send(await cartManager.postProductPorCart(parseInt(req.params.cid), parseInt(req.params.pid)));
});

export default route;
