import { Router } from "../classes/server/router.js";
import usuarioController from "../controllers/usuarios.controller.js"

class UsuarioRouter extends Router {
  constructor() {
    super("/usuarios");
  }
  init() {
    this.get("/", ["PUBLIC"], usuarioController.obtenerUsuarios.bind(usuarioController));
    this.get("/:idUsuario", ["PUBLIC"], usuarioController.getUsuarioById.bind(usuarioController));
    this.post("/", ["PUBLIC"], usuarioController.postUsuario.bind(usuarioController));
  }
}

const router = new UsuarioRouter();

export default router;
