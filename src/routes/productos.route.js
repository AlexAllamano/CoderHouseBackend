import { Router } from "../classes/server/router.js";
import productoController from "../controllers/productos.controller.js";

class ProductRouter extends Router {
  constructor() {
    super("/product");
  }
  init() {
    this.get("", ["PUBLIC"], productoController.getAllProducts);
    this.get("/:pid", ["PUBLIC"], productoController.getPorductById);
    this.post("", ["PUBLIC"], productoController.postProducto);
    this.delete("/:pid", ["PUBLIC"], productoController.borrarProducto);
    this.put("/:pid", ["PUBLIC"], productoController.alterProducto);
  }
}

const router = new ProductRouter();

export default router;
