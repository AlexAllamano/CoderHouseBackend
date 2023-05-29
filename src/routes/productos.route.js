import { Router } from "../classes/server/router.js";
import productoController from "../controllers/productos.controller.js";

class ProductRouter extends Router {
  constructor() {
    super("/product");
  }
  init() {
    this.get("", ["PUBLIC"], productoController.getAllProducts.bind(productoController));
    this.get("/:pid", ["PUBLIC"], productoController.getPorductById.bind(productoController));
    this.post("", ["ADMIN"], productoController.postProducto.bind(productoController));
    this.delete("/:pid", ["PUBLIC"], productoController.borrarProducto.bind(productoController));
    this.put("/:pid", ["PUBLIC"], productoController.alterProducto.bind(productoController));
  }
}

const router = new ProductRouter();

export default router;
