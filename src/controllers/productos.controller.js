import productoModel from "../models/producto.model.js";
import { socketServer } from "../socket/configure-socket.js";

class ProductoController {
  //obtengo todos los productos, limitado, filtrados y/o ordenados
  async getAllProducts(req, res, next) {
    try {
      const limite = req.query.limit ?? 5;
      const page = req.query.page ?? 1;
      const sort = req.query.sort ?? -1;
      const query = req.body ?? {};

      const products = await productoModel.paginate(
        {},
        { page: page, limit: limite, lean: true, sort: { price: sort } }
      );

      console.log(products);

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
      console.log(e);
      next(e);
    }
  }
  //obtengo un solo producto por id
  async getPorductById(req, res, enxt) {
    try {
      let pid = req.params.pid;
      const product = await productoModel.findById(pid);
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
      let productos = await productoModel.find();

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
        let newPorducto = await productoModel.create(producto);

        productos = await productoModel.find();
        console.log(newPorducto);

        console.log(productos);
        socketServer.emit("mensajePost", productos);
        res.status(200).send({ producto: newPorducto });
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  //borro un producto por id
  async borrarProducto(req, res, next) {
    try {
      let pid = req.params.pid;
      let result = await productoModel.deleteOne({ _id: pid });
      socketServer.emit(
        "mensajeDelete",
        await productoModel.paginate(
          {},
          { page: page, limit: limite, lean: true, sort: { price: sort } }
        )
      );
      res.status(200).send(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
   //modifico un producto por id
   async alterProducto(req, res, next){
    try {
        let pid = req.params.pid;
        let productToReplace = req.body;
        let result = await productoModel.updateOne({ _id: pid }, productToReplace);
        res.status(200).send(result);
      } catch (e) {
        next(e);
      }
   }
}

const controller = new ProductoController();
export default controller;
