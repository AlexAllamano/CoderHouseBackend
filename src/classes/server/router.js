import express from "express";
import jwt from "jsonwebtoken";
import data from "../../data.js";

export class Router {
  #router;
  #path;

  constructor(path, options = { middlewares: [] }) {
    this.#router = express.Router();
    this.#path = path;
    this.#router.use(generarCustomResponse);

    const { middlewares } = options;
    middlewares.length > 0 && this.#router.use(middlewares);

    this.init();
  }

  init() {}

  get path() {
    return this.#path;
  }

  get router() {
    return this.#router;
  }

  get(path, policies, ...callbacks) {
    this.#router.get(path, handlePolicies(policies), ...callbacks);
  }
  post(path, policies, ...callbacks) {
    this.#router.post(path, handlePolicies(policies), ...callbacks);
  }
  put(path, policies, ...callbacks) {
    this.#router.put(path, handlePolicies(policies), ...callbacks);
  }
  delete(path, policies, ...callbacks) {
    this.#router.delete(path, handlePolicies(policies), ...callbacks);
  }
}

function generarCustomResponse(req, res, next) {
  res.okResponse = (payload) => {
    res.status(200).send({
      status: "success",
      payload,
    });
  };
  res.serverError = (error) => {
    res.status(500).send({
      status: "error",
      error,
    });
  };
  res.userError = (error) => {
    res.status(400).send({
      status: "error",
      error,
    });
  };
  next();
}

const SECRET = data.SECRET;

function handlePolicies(policies) {
  return (req, res, next) => {
    try {

      if (!req.cookies.AUTH) {

        res.cookie("AUTH", "SIN USO");

        return res.redirect("/api/home");
      }

      if (policies.includes("PUBLIC")) {
        return next();
      }

      

      const user = jwt.verify(req.cookies.AUTH, SECRET);
      if (!policies.includes(user.user.role.toUpperCase())) {
        return res.status(401).send({ status: "error", error: "Acceso negado" });
      }

      if(Date.now() < user.exp){
        return res.status(403).send({ status: "error", error: "Token expirado" })
      } 
      req.user = user;

      next();
    } catch (e) {
      res.render("noEncontrado", {
        title: "Error de autentificación",
        mensaje: "Vuelva a iniciar sesión",
        login: false
      });
    }
  };
}
