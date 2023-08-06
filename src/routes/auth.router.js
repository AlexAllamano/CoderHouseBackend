import userModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import passport from "passport";
import { Router } from "../classes/server/router.js";
import logger from "../classes/logs/winston-logger.js";
import jwtController from "../controllers/jwt.controller.js";

class AuthRouter extends Router {
  constructor() {
    super("/auth");
  }
  init() {
    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/api/auth/loginfallido",
      }),
      async (req, res) => {
        req.session.correo = req.user.correo;

        res.cookie("AUTH", jwtController.post(req.user), {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        });

        res.redirect("/api/products");
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
      res.render("noEncontrado",{
        title: "Registro Fallido",
        mensaje: "Por favor, volver a intenar",
        login: true
      })
    });

    this.get("/loginfallido", ["PUBLIC"], (req, res) => {
      res.render("noEncontrado",{
        title: "Login Fallido",
        mensaje: "Usuario o contraseña incorrectas",
        login: true
      })
    });

    this.post("/password-olvidada", ["PUBLIC"], async (req, res) => {
      try {
        const { correo, password } = req.body;
        const usuario = await userModel.findOne({ correo });
        const hashedPassword = createHash(password);
        if (!usuario) {
          res.render("noEncontrado", {
            title: "Usuario no encontrado",
            mensaje: "Error: Usuario no encontrado",
            login: false
          });
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
        logger.info(req.user, "usuario logueado con github");
        req.session.correo = req.user.correo;
        res.redirect("/products");
      }
    );
  }
}

const router = new AuthRouter();

export default router;
