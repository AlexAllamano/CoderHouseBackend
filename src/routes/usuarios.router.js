import { Router } from "../classes/server/router.js";
import { userModel } from "../models/usuario.model.js";

class UsuarioRouter extends Router {
  constructor() {
    super("/usuarios");
  }
  init() {
    this.get("/", ['PUBLIC'],async (req, res, next) => {
      const { skip, limit, ...query } = req.query;

      try {
        const usuarios = await userModel.paginate(query, {
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
    });

    this.get("/:idUsuario", ['PUBLIC'], async (req, res, next) => {
      try {
        const idUsuario = req.params.idUsuario;

        const usuario = await userModel.findOne({ _id: idUsuario });
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
    });

    this.post("/", ['PUBLIC'], async (req, res, next) => {
      const usuario = req.body;

      try {
        const { _id } = await userModel.create(usuario);

        res.status(201).send({ id: _id });
      } catch (error) {
        next(error);
      }
    });
  }
}

const router = new UsuarioRouter();

export default router;
