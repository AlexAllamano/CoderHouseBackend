import { Router } from "express";
import manager from "../dao/carts.manager.js";

const route = Router();

route.post("", async (req, res, next) => {
  try {
    // res.send(await cartManager.addCart());
  } catch (e) {
    next(e);
  }
});

route.get("/:cid", async (req, res, next) => {
  try {
    //   res.send(await cartManager.getCartById(req.params.cid));
  } catch (e) {
    next(e);
  }
});

route.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    //   res.send(
    //     await cartManager.postProductPorCart(
    //       parseInt(req.params.cid),
    //       parseInt(req.params.pid)
    //     )
    //   );
  } catch (e) {
    next(e);
  }
});

export default route;
