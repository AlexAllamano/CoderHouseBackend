import { Router } from "../classes/server/router.js";
import usuarioController from "../controllers/usuarios.controller.js"

class UsuarioRouter extends Router {
  constructor() {
    super("/usuarios");
  }
  init() {
    this.get("/", ["PUBLIC"], usuarioController.obtenerUsuarios);
    this.get("/:idUsuario", ["PUBLIC"], usuarioController.getUsuarioById);
    this.post("/", ["PUBLIC"], usuarioController.postUsuario);
  }
}

const router = new UsuarioRouter();

export default router;
