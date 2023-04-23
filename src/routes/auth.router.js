import { Router } from "express";
import { userModel } from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import passport from "passport";

const route = Router();

route.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/auth/loginfallido" }),
  async (req, res) => {
    req.session.correo = req.user.correo;

    res.redirect("/products");
  }
);

route.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/auth/registrofallido",
  }),
  async (req, res) => {
    res.status(201).send({ message: "Usuario registrado" });
  }
);

route.get("/registrofallido", (req, res) => {
  res.send({ error: "Error en el registro" });
});

route.get("/loginfallido", (req, res) => {
  res.send({ error: "Error en el login: usuario o contraseña incorrecta" });
});

route.post("/password-olvidada", async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await userModel.findOne({ correo });
    const hashedPassword = createHash(password);
    if (!usuario) {
      res.status(404).send({ mensaje: "usuario no encontrado" });
      return;
    }
    await userModel.updateOne(
      { correo },
      { $set: { password: hashedPassword } }
    );
    res.send({ mensjae: "Constraseña modificada" });
  } catch (e) {}
});

route.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

route.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    console.log(req.user);
    req.session.correo = req.user.correo;
    res.redirect("/products");
  }
);
export default route;
