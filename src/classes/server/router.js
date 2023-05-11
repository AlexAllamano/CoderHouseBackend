import express from "express";
import jwt from "jsonwebtoken";

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
    this.#router.get(path, handlePolicies(policies),...callbacks);
  }
  post(path, policies, ...callbacks) {
    this.#router.post(path, handlePolicies(policies),...callbacks);
  }
  put(path, policies, ...callbacks) {
    this.#router.put(path, handlePolicies(policies),...callbacks);
  }
  delete(path, policies, ...callbacks) {
    this.#router.delete(path, handlePolicies(policies),...callbacks);
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

function handlePolicies(policies) {
  return (req, res, next) => {
    if (policies.includes("PUBLIC")) {
      return next();
    }
    const authHeader = req.headers["Authorization"];
    if (!authHeader) {
      return res.status(401).send({ status: "error", error: "No autorizado" });
    }
    const token = authHeader.split(" ");
    const user = jwt.verify(token, "CODER_SUPER_SECRETO");
    if (!policies.includes(user.user.rol.toUpperCase())) {
      res.status(403).send({ status: "error", error: "Acceso negado" });
    }
    req.user = user;
    next();
  };
}
