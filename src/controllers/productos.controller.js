import logger from "../classes/logs/winston-logger.js";
import MockingService from "../classes/mocks/moks.js";
import ProductoService from "../services/product.services.js";
import { socketServer } from "../socket/configure-socket.js";

class ProductoController {

  #productoSercive
  constructor(service){
    this.#productoSercive = service;
  }


  //obtengo todos los productos, limitado, filtrados y/o ordenados
  async getAllProducts(req, res, next) {
    try {
      const limite = req.query.limit ?? 5;
      const page = req.query.page ?? 1;
      const sort = req.query.sort ?? -1;
      const query = req.body ?? {};

      const products = await this.#productoSercive.paginate(
        {},
        { page: page, limit: limite, lean: true, sort: { price: sort } }
      );

      logger.info("Productos obtenidos", products);

      res.status(200).send({
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
      });
      // res.status(200).send('fin')
    } catch (e) {
      logger.error("Error al obtener los productos", e);
      next(e);
    }
  }
  //obtengo un solo producto por id
  async getPorductById(req, res, next) {
    try {
      let pid = req.params.pid;
      const product = await this.#productoSercive.findById(pid);
      res.status(200).send({ product: product });
    } catch (e) {
      next(e);
    }
  }
  //agrego un producto a la DB
  async postProducto(req, res, next) {
    try {
      let bandera = false;
      const producto = req.body;
      let productos = await this.#productoSercive.find();

      productos.forEach((item) => {
        if (producto.code === item.code) {
          bandera = true;
        }
      });
      if (bandera) {
        res
          .status(200)
          .send({ Error: "Ya existe un producto con ese code registrado" });
      } else {
        let newPorducto = await this.#productoSercive.create(producto);

        productos = await this.#productoSercive.find();
        logger.info("Producto agregado", newPorducto);

        logger.info("Productos", productos);
        socketServer.emit("mensajePost", productos);
        res.status(200).send({ producto: newPorducto });
      }
    } catch (e) {
      logger.error("Error al agregar el producto", e);
      next(e);
    }
  }
  //borro un producto por id
  async borrarProducto(req, res, next) {
    try {
      let pid = req.params.pid;
      let result = await this.#productoSercive.delete({ _id: pid });
      socketServer.emit(
        "mensajeDelete",
        await this.#productoSercive.paginate(
          {},
          { page: page, limit: limite, lean: true, sort: { price: sort } }
        )
      );
      res.status(200).send(result);
    } catch (e) {
      logger.error("Error al borrar el producto", e);
      next(e);
    }
  }
   //modifico un producto por id
   async alterProducto(req, res, next){
    try {
        let pid = req.params.pid;
        let productToReplace = req.body;
        let result = await this.#productoSercive.update({ _id: pid }, productToReplace);
        res.status(200).send(result);
      } catch (e) {
        next(e);
      }
   }

  

}

const controller = new ProductoController(new ProductoService());
export default controller;
