import CarritoService from "../services/cart.services.js";
import UsuarioService from "../services/usuarios.services.js";

class UsuarioController {

  #usuarioSercive
  #carritoSercive
  constructor(service, service2){
    this.#usuarioSercive = service;
    this.#carritoSercive = service2;
  }

  async obtenerUsuarios(req, res, next) {
    const { skip, limit, ...query } = req.query;

    try {
      const usuarios = await this.#usuarioSercive.paginate(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 10),
      });
      res.send({
        usuarios: usuarios.docs,
        total: usuarios.totalDocs,
        totalPages: usuarios.totalPages,
        hasNextPage: usuarios.hasNextPage,
        hasPrevPage: usuarios.hasPrevPage,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsuarioById(req, res, next) {
    try {
      const idUsuario = req.params.idUsuario;

      const usuario = await this.#usuarioSercive.findOne({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      res.send({ usuario });
    } catch (error) {
      next(error);
    }
  }

  async postUsuario(req, res, next) {
    let usuario = req.body;

    try {
      const {_id: cartId} = await this.#carritoSercive.create();
      usuario = {...usuario, cartId}

      const { _id } = await this.#usuarioSercive.create(usuario);


      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new UsuarioController(new UsuarioService(), new CarritoService());
export default controller;
