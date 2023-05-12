import carritoModel from "../models/cart.model.js";
import productoModel from "../models/producto.model.js";

class CartController {
  //obtiene el carrito con el ID facilitad
  async getCartByID(req, res, next) {
    try {
      let cid = req.params.cid;

      res.status(200).send({ carrito: await carritoModel.findById(cid) });
    } catch (e) {
      next(e);
    }
  }

  //agregar un carrito con productos vacios
  async createEmpityCart(req, res, next) {
    try {
      const newCart = await carritoModel.create();
      console.log(newCart, "NUEVO");

      if (!newCart) {
        throw new Error("Error al crear el carrito");
      }

      res.status(200).send({ carritoNuevo: newCart });
    } catch (e) {
      next(e);
    }
  }
  //cargar un producto a un carrito, solo 1. Agregar 1 si ya existe
  async addOneProductCart(req, res, next) {
    try {
      //validaciones
      let bandera = true;
      let todoOk = true;
      let mensajeError = "";
      const cid = req.params.cid;
      const pid = req.params.pid;

      //busco producto y carrito por id
      const producto = await productoModel.findById(pid);
      let carrito = await carritoModel
        .findOne({ _id: cid })
        .populate("products.product")
        .lean();

      //valido que existan
      if (carrito.Error) {
        mensajeError += "Carrito no encontrado. ";
        todoOk = false;
      }
      if (producto.Error) {
        mensajeError += "Producto no encontrado. ";
        todoOk = false;
      }

      //si existen ambos....
      if (todoOk) {
        carrito.products.forEach((item) => {
          if (item.product._id.toString() == producto._id.toString()) {
            bandera = false;
            item.quantity++;
          }
        });

        if (bandera) {
          carrito.products.push({
            product: producto._id.toString(),
            quantity: 1,
          });
        }

        await carritoModel.updateOne({ _id: cid }, carrito);
        res
          .status(200)
          .send({ mensaje: "Carrito actualizado", carrito: carrito });
      } else {
        res.status(200).send({ Error: mensajeError });
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  //modificar los productos del carrito a partir de un array
  //Formato:
  // [{
  //   product: String,
  //   quantity: number
  // }]
  async alterCart(req, res, next) {
    try {
      let bandera = false;
      let mensaje = "";
      const productos = req.body;
      const cid = req.params.cid;

      //busco carrito por id
      let carrito = await await carritoModel
        .findOne({ _id: cid })
        .populate("products.product")
        .lean();

      //valido que existan
      if (carrito.Error) {
        res.status(200).send({ Error: "Carrito no encontrado. " });
      }

      for (const item of productos) {
        let producto = await productoModel.findById(pid);
        if (producto.Error) {
          mensaje += `, ${item.product}`;
          bandera = true;
        }
      }

      if (bandera) {
        res.status(200).send({
          Mensaje: `El producto(s) con el id(s)${mensaje} no existe(n), cancelando...`,
        });
      }

      carrito.products = productos;

      console.log(carrito);

      await carritoModel.updateOne({ _id: cid }, carrito);
      res
        .status(200)
        .send({ mensaje: "Carrito actualizado", carrito: carrito });
    } catch (e) {
      next(e);
    }
  }
  //modificar la cantidad de un producto especificado
  //Formato:
  // {
  //   quantity: number
  // }
  async alterProductQuantity(req, res, next) {
    try {
      //validaciones
      let bandera = true;
      let todoOk = true;
      let mensajeError = "";
      const cantidad = req.body;
      const cid = req.params.cid;
      const pid = req.params.pid;

      //busco producto y carrito por id
      const producto = await productoModel.findById(pid);
      let carrito = await carritoModel
        .findOne({ _id: cid })
        .populate("products.product")
        .lean();

      //valido que existan
      if (carrito.Error) {
        mensajeError += "Carrito no encontrado. ";
        todoOk = false;
      }
      if (producto.Error) {
        mensajeError += "Producto no encontrado. ";
        todoOk = false;
      }

      //si existen ambos....
      if (todoOk) {
        carrito.products.forEach((item) => {
          if (item.product._id.toString() == producto._id.toString()) {
            bandera = false;
            item.quantity = cantidad.quantity;
          }
        });

        if (bandera) {
          res.status(200).send({
            Error: `El carrito no contiene el producto con id ${pid}`,
          });
        } else {
          await carritoModel.updateOne({ _id: cid }, carrito);
          res
            .status(200)
            .send({ mensaje: "Carrito actualizado", carrito: carrito });
        }
      } else {
        res.status(200).send({ Error: mensajeError });
      }
    } catch (e) {
      next(e);
    }
  }
  //borrar el producto seleccionado
  async deleteOneProduct(req, res, next) {
    try {
      //validaciones
      let todoOk = true;
      let mensajeError = "";
      const cid = req.params.cid;
      const pid = req.params.pid;

      //busco producto y carrito por id
      const producto = await productoModel.findById(pid);
      let carrito = await carritoModel
        .findOne({ _id: cid })
        .populate("products.product")
        .lean();

      //valido que existan
      if (carrito.Error) {
        mensajeError += "Carrito no encontrado. ";
        todoOk = false;
      }
      if (producto.Error) {
        mensajeError += "Producto no encontrado. ";
        todoOk = false;
      }

      //si existen ambos....
      if (todoOk) {
        carrito.products = carrito.products.filter(
          (item) => item.product._id.toString() != producto._id
        );
        await carritoModel.updateOne({ _id: cid }, carrito);
        res
          .status(200)
          .send({ mensaje: "Producto eliminado", carrito: carrito });
      } else {
        res.status(200).send({ Error: mensajeError });
      }
    } catch (e) {
      next(e);
    }
  }
  //borrar todos los productos del carrito
  async deleteAllProducts(req, res, next) {
    try {
      const cid = req.params.cid;

      //busco carrito por id
      let carrito = await carritoModel
        .findOne({ _id: cid })
        .populate("products.product")
        .lean();

      //valido que existan
      if (carrito.Error) {
        res.status(200).send({ Error: "Carrito no encontrado. " });
      }

      carrito.products = [];

      await carritoModel.updateOne({ _id: cid }, carrito);
      res
        .status(200)
        .send({ mensaje: "Todos los producto eliminado", carrito: carrito });
    } catch (e) {
      next(e);
    }
  }
}

const controller = new CartController();
export default controller;
