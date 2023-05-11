import { Router } from "../classes/server/router.js";
import { userModel } from "../models/usuario.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { passportCall, authorization } from "../utils/auth.js";

const SECRET = "CODER_SUPER_SECRETO";

const users = [];

class JwtRouter extends Router{
  constructor() {
    super("/jwt");
  }
  init(){
    this.post("/register", ['PUBLIC'], (req, res) => {
      try {
        const user = req.body;
        users.push(user);
        const token = generarToken({ ...user, rol: "ADMIN" });
        res.cookie("AUTH", token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        });
        res.send({ token });
      } catch (error) {
        console.log(error);
      }
    });
    function generarToken(user) {
      const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
      return token;
    }
    this.get(
      "/data", ['PUBLIC'],
      passportCall("jwt"),
      authorization("ADMIN"),
      //   passport.authenticate("jwt", { session: false }),
      (req, res) => {
        res.send(req.user);
      }
    );
    
    function verifyToken(req, res, next) {
      const authHeader = req.headers["authorization"];
      //authHeader = 'Beader TOKEN'
      const token = authHeader?.split("")[1];
      if (!token) {
        return res.sensStatus(401);
      }
      jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
          return res.sensStatus(403);
        }
        req.user = payload.user;
        next();
      });
    }
  }
}
const router = new JwtRouter();

export default router;
