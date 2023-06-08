import carritoModel from "../models/cart.model.js";
import productoModel from "../models/producto.model.js";
import usuarioModel from "../models/usuario.model.js";

class ViewsController {
  async getHome(req, res, next) {
    let limite = 5,
      page = 1,
      sort = -1,
      query = {};

    const products = await productoModel.paginate(
      {},
      { page: page, limit: limite, lean: true, sort: { price: sort } }
    );

    res.render("home", { title: "Home", products });
  }

  async getRegistro(req, res, enxt) {

    let limite = 5,
      page = 1,
      sort = -1,
      query = {};

    const products = await productoModel.paginate(
      {},
      { page: page, limit: limite, lean: true, sort: { price: sort } }
    );

    res.render("registro", { title: "Registro", products });
  }

  async getRealTimeProducts(req, res, next) {
    let limite = 5,
      page = 1,
      sort = -1,
      query = {};

    const products = await productoModel.paginate(
      {},
      { page: page, limit: limite, lean: true, sort: { price: sort } }
    );

    res.render("realTimeProducts", { title: "RealTimeProducts", products });
  }

  async getProducts(req, res, next) {
    const query = req.query;
    const correo = req.session.correo;
    let usuario;

    if (correo == "adminCoder@coder.com") {
      usuario = {
        nombre: "Usuario",
        apellido: "Coder",
        correo: "adminCoder@coder.com",
        edad: 100,
        password: "adminCod3r123",
        rol: "Admin",
      };
    } else {
      usuario = await usuarioModel.findOne({ correo });
    }

    const products = await productoModel.paginate(
      {},
      {
        page: 1,
        limit: 5,
        lean: true
      }
    );

    if (query.page > products.totalPages || query.page <= 0) {
      res.render("noEncontrado", {
        title: "Página no encontrada",
        mensaje: `La página ingresada no existe para el límite asignado`,
      });
    } else if (query.limite > products.totalDocs || query.limite <= 0) {
      res.render("noEncontrado", {
        title: "Página no encontrada",
        mensaje: `Está intenando mostrar un número superior o inferior a la cantidad de documentos disponibles`,
      });
    } else {

      const carritoId = usuario.cartId.toString();

      res.render("products", {
        title: "Productos",
        products: products.docs,
        paginas: products.totalPages,
        pagina: products.page,
        tienePrev: products.hasPrevPage,
        tieneNext: products.hasNextPage,
        prev: products.prevPage,
        next: products.nextPage,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        rolUsuario: usuario.role,
        cartId: carritoId
      });
    }
  }

  async getCartById(req, res, next) {
    const cid = req.params.cid;

    let carrito = await carritoModel
      .findOne({ _id: cid })
      .populate("products.product")
      .lean();

    if (carrito.Error) {
      res.render("noEncontrado", {
        title: "Carrito no encontrado",
        mensaje: `El carrito con el id ${cid} no existe`,
      });
    } else {
      res.render("carritos", {
        title: "Carrito",
        cid: cid,
        productos: carrito.products,
      });
    }
  }

  async getChats(req, res, next) {
    const products = await productoModel.getAll();

    res.render("chat", {});
  }
}

const controller = new ViewsController();
export default controller;
