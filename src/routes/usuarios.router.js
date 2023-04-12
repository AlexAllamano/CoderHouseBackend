import { Router } from "express";
import { userModel } from "../models/usuario.model.js";

const route = Router();

route.get("/", async (req, res, next) => {
  const { skip, limit, ...query } = req.query;

  try {
    const usiarios = await userModel.paginate(query, {
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

route.get("/:idUsuario", async (req, res, next) => {
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

route.post("/", async (req, res, next) => {

  const usuario = req.body;

  try {
    const { _id } = await userModel.create(usuario);

    res.status(201).send({ id: _id });
  } catch (error) {
    next(error);
  }
});


export default route;
