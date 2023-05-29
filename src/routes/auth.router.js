import userModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import passport from "passport";
import { Router } from "../classes/server/router.js";

class AuthRouter extends Router {
  constructor() {
    super("/auth");
  }
  init() {
    this.post(
      "/login",["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/api/auth/loginfallido",
      }),
      async (req, res) => {
        req.session.correo = req.user.correo;

        res.redirect("/products");
      }
    );

    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/api/auth/registrofallido",
      }),
      async (req, res) => {
        res.status(201).send({ message: "Usuario registrado" });
      }
    );

    this.get("/registrofallido", ["PUBLIC"], (req, res) => {
      res.send({ error: "Error en el registro" });
    });

    this.get("/loginfallido", ["PUBLIC"], (req, res) => {
      res.send({ error: "Error en el login: usuario o contraseña incorrecta" });
    });

    this.post("/password-olvidada", ["PUBLIC"], async (req, res) => {
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

    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );

    this.get(
      "/github-callback",
      ["PUBLIC"],
      passport.authenticate("github", { failureRedirect: "/" }),
      (req, res) => {
        console.log(req.user);
        req.session.correo = req.user.correo;
        res.redirect("/products");
      }
    );
  }
}

const router = new AuthRouter();

export default router;
