import CarritoService from "../services/cart.services.js";
import UsuarioService from "../services/usuarios.services.js";

class UsuarioController {
  #usuarioSercive;
  #carritoSercive;
  constructor(service, service2) {
    this.#usuarioSercive = service;
    this.#carritoSercive = service2;
  }

  async obtenerUsuarios(req, res, next) {
    const { skip, limit, ...query } = req.query;

    try {
      const usuarios = await this.#usuarioSercive.paginate(query, {
        skip: Number(skip ?? 0),
        limit: Number(limit ?? 100),
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
      const { _id: cartId } = await this.#carritoSercive.create();
      usuario = { ...usuario, cartId };

      const { _id } = await this.#usuarioSercive.create(usuario);

      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
  }

  async cambiarRole(req, res, next) {
    let correo = req.params.correo;

    const usuario = await this.#usuarioSercive.findByCorreo(correo);
    let nuevoRole = "";

    if (!usuario) {
      res.render("noEncontrado", {
        title: "Usuario no encontrado",
        mensaje: "Error: Usuario no encontrado",
        login: false
      });
    } else {
      nuevoRole = usuario.tipoUsuario === "normal" ? "premium" : "normal";
      usuario.tipoUsuario = nuevoRole;
      await this.#usuarioSercive.update(usuario._id, {
        tipoUsuario: nuevoRole,
      });
    }
    res.send(`Role del usuario actualizado: ${nuevoRole}`);
  }

  async borrarInactivos(req, res, next) {
    try {
      let usuariosInactivos = await this.#usuarioSercive.getUsuariosInactivos();
      usuariosInactivos = usuariosInactivos.filter(
        (item) => item.nombre !== "Admin"
      );


      if (usuariosInactivos.length > 0) {
        for (const usuario of usuariosInactivos) {
          await this.#usuarioSercive.deleteByCorreo(usuario.correo);
          await this.#usuarioSercive.enviarCorreoUsuarioEliminado(usuario.correo);
        }

        res.status(200).send({ mensaje: "Usuarios borrados" });
      } else {
        res
          .status(202)
          .send({ mensaje: "No se encontraron usuarios inactivos" });
      }
    } catch (e) {
      next(e);
    }
  }

  async borrarUsuario(req, res, next) {
    let correo = req.params.correo;

    const usuario = await this.#usuarioSercive.findByCorreo(correo);
    if (!usuario) {
      res.render("noEncontrado", {
        title: "Usuario no encontrado",
        mensaje: "Error: Usuario no encontrado",
        login: false
      });
    } else {
      await this.#usuarioSercive.delete(usuario._id);
      await this.#carritoSercive.delete(usuario.cartId);
      res.status(200).send({mensaje: "Usuario borrado"})
    }
  }
}

const controller = new UsuarioController(
  new UsuarioService(),
  new CarritoService()
);
export default controller;
