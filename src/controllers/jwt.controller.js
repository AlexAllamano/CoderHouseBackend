import jwt from "jsonwebtoken";
import data from "../data.js";

const SECRET = data.SECRET;

class JwtController {
   post(usuario) {
    const token = this.generarToken(usuario);
    return token;
  }

  generarToken(user) {
    const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
    return token;
  }
}

const JWT = new JwtController();
export default JWT;
