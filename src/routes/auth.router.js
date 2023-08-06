import jwt from "jsonwebtoken";
import passport from "passport";
import { Router } from "../classes/server/router.js";
import logger from "../classes/logs/winston-logger.js";
import jwtController from "../controllers/jwt.controller.js";
import UsuarioService from "../services/usuarios.services.js";
import config from "./../data.js";
import nodemailer from "nodemailer";
import { createHash } from "../utils/crypto.js";
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
      res.render("noEncontrado", {
        title: "Registro Fallido",
        mensaje: "Por favor, volver a intenar",
        login: true,
      });
    });

    this.get("/loginfallido", ["PUBLIC"], (req, res) => {
      res.render("noEncontrado", {
        title: "Login Fallido",
        mensaje: "Usuario o contraseña incorrectas",
        login: true,
      });
    });

    this.get("/password-olvidada/:token", ["PUBLIC"], async (req, res) => {
      try {
        const token = req.params.token;


        if (!token) {
          res.render("noEncontrado", {
            title: "Error de autentificación",
            mensaje: "Vuelva al inicio",
            login: true,
          });
        } else {
          const correo = jwt.verify(token, config.SECRET);


          if (!correo.email) {
            res.render("noEncontrado", {
              title: "Error de autentificación",
              mensaje: "Vuelva al inicio",
              login: true,
            });
          } else {
            res.render("recuperarPass", {});
          }
        }
      } catch (e) {}
    });

    this.get("/recuperarPass/:correo", ["PUBLIC"], async (req, res) => {
      const correo = req.params.correo;

      const us = new UsuarioService();

      try {
        const usuario = await us.findByCorreo(correo);

        if (!usuario) {
          res.render("noEncontrado", {
            title: "Usuario no encontrado",
            mensaje: "No hay usuario con el correo especificado",
            login: true,
          });
        } else {
          const token = jwt.sign({ email: correo }, config.SECRET, {
            expiresIn: "24h",
          });

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: "alexallamano@gmail.com",
              pass: config.CLAVE_GMAIL,
            },
          });

          transporter
            .sendMail({
              from: "'CoderHouse Backend' <proyecto@coderhouse.com>",
              to: correo,
              subject: "Recuperar contraseña",
              html: `
              <h2>Para recuperar su contraseña haga clic <a href="coderhousebackend-production-b304.up.railway.app/api/auth/password-olvidada/${token}">aquí</a></h2>
            `,
            })
            .then((info) => {
              logger.info(info, "Correo enviado");
            })
            .catch((error) => {
              logger.error(error);
            });
        }
      } catch (error) {
      }
    });

    this.put(
      "/modificarClave/:token/:nuevaClave",
      ["PUBLIC"],
      async (req, res) => {
        const us = new UsuarioService();
        const nuevaClave = req.params.nuevaClave
        const token = req.params.token
        const correo = jwt.verify(token, config.SECRET);

     

        if (!correo) {
          res.render("noEncontrado", {
            title: "Error de autentificación",
            mensaje: "Vuelva al inicio",
            login: false,
          });
        } else {
          const usuario = await us.findByCorreo( correo.email );
          const hashedPassword = createHash(nuevaClave);

          if (!usuario) {
            res.render("noEncontrado", {
              title: "Usuario no encontrado",
              mensaje: "Error: Usuario no encontrado",
              login: false,
            });
          }
          await us.update(
             usuario._id ,
            { $set: { password: hashedPassword } }
          );
          res.render("noEncontrado", {
            title: "Clave actualizada",
            mensaje: "Cambio de clave exitoso",
            login: false,
          });
        }
      }
    );

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
