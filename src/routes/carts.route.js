
import { Router } from "../classes/server/router.js";
import carritoController from "../controllers/cart.controller.js";
class CartRouter extends Router {
  constructor() {
    super("/cart");
  }
  init() {
    this.get("/:cid", ["PUBLIC"], carritoController.getCartByID.bind(carritoController));
    this.post("", ["PUBLIC"], carritoController.createEmpityCart.bind(carritoController));
    this.post("/:cid/product/:pid", ["PUBLIC"], carritoController.addOneProductCart.bind(carritoController));
    this.post("/:cid/comprar", ["PUBLIC"], carritoController.realizarCompra.bind(carritoController));
    this.put("/:cid", ["PUBLIC"], carritoController.alterCart.bind(carritoController));
    this.put("/:cid/product/:pid", ["PUBLIC"], carritoController.alterProductQuantity.bind(carritoController));
    this.delete("/:cid/product/:pid", ["PUBLIC"], carritoController.deleteOneProduct.bind(carritoController));
    this.delete("/:cid", ["PUBLIC"], carritoController.deleteAllProducts.bind(carritoController));  }
}

const router = new CartRouter();

export default router;
