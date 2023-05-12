
import { Router } from "../classes/server/router.js";
import carritoController from "../controllers/cart.controller.js";
class CartRouter extends Router {
  constructor() {
    super("/cart");
  }
  init() {
    this.get("/:cid", ["PUBLIC"], carritoController.getCartByID);
    this.post("", ["PUBLIC"], carritoController.createEmpityCart);
    this.post("/:cid/product/:pid", ["PUBLIC"], carritoController.addOneProductCart);
    this.put("/:cid", ["PUBLIC"], carritoController.alterCart);
    this.put("/:cid/product/:pid", ["PUBLIC"], carritoController.alterProductQuantity);
    this.delete("/:cid/product/:pid", ["PUBLIC"], carritoController.deleteOneProduct);
    this.delete("/:cid", ["PUBLIC"], carritoController.deleteAllProducts);  }
}

const router = new CartRouter();

export default router;
