import { Router } from "../classes/server/router.js";
import usuarioController from "../controllers/usuarios.controller.js"

class UsuarioRouter extends Router {
  constructor() {
    super("/usuarios");
  }
  init() {
    this.get("/", ["ADMIN"], usuarioController.obtenerUsuarios.bind(usuarioController));
    this.get("/:idUsuario", ["ADMIN"], usuarioController.getUsuarioById.bind(usuarioController));
    this.post("/", ["ADMIN"], usuarioController.postUsuario.bind(usuarioController));
    this.put("/cambiarRole/:correo", ["ADMIN"], usuarioController.cambiarRole.bind(usuarioController));
    this.delete("/usuariosInactivos", ["ADMIN"], usuarioController.borrarInactivos.bind(usuarioController));
    this.delete("/:correo", ["ADMIN"], usuarioController.borrarUsuario.bind(usuarioController));
  }
}

const router = new UsuarioRouter();

export default router;
