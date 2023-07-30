import logger from "../classes/logs/winston-logger.js";
import CarritoService from "../services/cart.services.js";
import ProductoService from "../services/product.services.js";
import TicketService from "../services/tickets.services.js";
import UsuarioService from "../services/usuarios.services.js";

class CartController {
  #carritoService;
  #productoService;
  #usuarioService;
  #ticketService;
  constructor(service, service2, service3, service4) {
    this.#carritoService = service;
    this.#productoService = service2;
    this.#usuarioService = service3;
    this.#ticketService = service4;
  }

  //obtiene el carrito con el ID facilitad
  async getCartByID(req, res, next) {
    try {
      let cid = req.params.cid;

      res
        .status(200)
        .send({ carrito: await this.#carritoService.findById(cid) });
    } catch (e) {
      next(e);
    }
  }

  //agregar un carrito con productos vacios
  async createEmpityCart(req, res, next) {
    try {
      const newCart = await this.#carritoService.create();
      

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
      const producto = await this.#productoService.findById(pid);
      let carrito = await this.#carritoService.findOne({ _id: cid });

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

        await this.#carritoService.update({ _id: cid }, carrito);
        res
          .status(200)
          .send({ mensaje: "Carrito actualizado", carrito: carrito });
      } else {
        res.status(200).send({ Error: mensajeError });
      }
    } catch (e) {
      logger.error(e);
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
      let carrito = await await this.#carritoService.findOne({ _id: cid });

      //valido que existan
      if (carrito.Error) {
        res.status(200).send({ Error: "Carrito no encontrado. " });
      }

      for (const item of productos) {
        let producto = await this.#productoService.findById(pid);
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

      logger.info(carrito);

      await this.#carritoService.updateOne({ _id: cid }, carrito);
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
      const producto = await this.#productoService.findById(pid);
      let carrito = await this.#carritoService.findOne({ _id: cid });

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
          await this.#carritoService.updateOne({ _id: cid }, carrito);
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
      const producto = await this.#productoService.findById(pid);
      let carrito = await this.#carritoService.findOne({ _id: cid });

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
        await this.#carritoService.updateOne({ _id: cid }, carrito);
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
      let carrito = await this.#carritoService.findOne({ _id: cid });

      //valido que existan
      if (carrito.Error) {
        res.status(200).send({ Error: "Carrito no encontrado. " });
      }

      carrito.products = [];

      await this.#carritoService.updateOne({ _id: cid }, carrito);
      res
        .status(200)
        .send({ mensaje: "Todos los producto eliminado", carrito: carrito });
    } catch (e) {
      next(e);
    }
  }

  async realizarCompra(req, res, next) {
    try {
      const { cid } = req.params;
      let carrito = await this.#carritoService.findOne(cid);

      if (!carrito) {
        res
          .status(404)
          .send({ error: `No se encontró el carrito con id ${cid}` });
        return;
      }
      if (carrito.products.length === 0) {
        res.status(200).send({ error: `El carrito está vacío` });
        return;
      }

      const usuario = await this.#usuarioService.findByCartId(carrito);
      const comprador = usuario.correo;
      let total = 0;
      const productosLista = [];
      const productosSinComprar = [];

      for (const item of carrito.products) {
        const pid = item.product._id.toString();
        const producto = await this.#productoService.findById(pid);

        if (producto.stock >= item.quantity) {
          let nuevoStock = producto.stock - item.quantity;
          await this.#productoService.update(pid, { stock: nuevoStock });
          total = total + item.product.price * item.quantity;
          productosLista.push(item);
        } else {
          productosSinComprar.push(item);
        }
      }

      const ticket = {
        monto: total,
        comprador: comprador,
        cartId: cid,
        productos: productosLista,
      };
      const ticketCreado = await this.#ticketService.create(ticket);
      carrito.products = productosSinComprar;
      await this.#carritoService.update(cid, carrito);
      res
        .status(201)
        .send({
          mensaje: `Ticket creado con ID ${ticketCreado._id}`,
          ticketCreado,
        });

        await this.#carritoService.enviarTicketEmail(comprador)
    } catch (error) {
      next(error);
    }
  }
}

const controller = new CartController(
  new CarritoService(),
  new ProductoService(),
  new UsuarioService(),
  new TicketService()
);
export default controller;
