import jwt from "jsonwebtoken";
import passport from "passport";
import { passportCall, authorization } from "../utils/auth.js";
import data from "../data.js";

const SECRET = data.SECRET;

const users = [];

class JwtController {
  async post(req, res, next) {
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
  }

  async get(req, res, next) {
    {
      res.send(req.user);
    }
  }
}

function generarToken(user) {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" });
  return token;
}

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

const controller = new JwtController();
export default controller;
