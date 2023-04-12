import { Router } from "express";
import { userModel } from "../models/usuario.model.js";

const route = Router();

route.post("/login", async (req, res) => {
  console.log(req.body);
  const { correo, password } = req.body;
  let usuario;

  if (correo == "adminCoder@coder.com" && password == "adminCod3r123") {
    usuario = {
      nombre: "Usuario",
      apellido: "Coder",
      correo: "adminCoder@coder.com",
      edad: 100,
      password: "adminCod3r123",
    };
  } else {
    usuario = await userModel.findOne({ correo, password });
  }

  if (!usuario) {
    return res.status(401).send({ error: "Correo o contraseña incorrectos" });
  }

  req.session.correo = correo;

  res.redirect("/products");
});

export default route;
