import passport from "passport";
import local from "passport-local";

import { createHash, isValidPassword } from "../utils/crypto.js";
import github from "passport-github2";
import jwt from "passport-jwt";
import data from "../data.js";

import userModel from "../models/usuario.model.js";
import carritoModel from "../models/cart.model.js";
import logger from "../classes/logs/winston-logger.js";

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;
const JWTStrategy = jwt.Strategy;

export function configurePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "correo",
      },
      async (req, username, password, done) => {
        try {
          const { nombre, apellido, edad, role } = req.body;
          const userExist = await userModel.findOne({ correo: username });
          if (userExist) {
            return done(null, false);
          }

          const nuevoCarrito = await carritoModel.create({});

          const newUser = await userModel.create({
            nombre,
            edad,
            apellido,
            correo: username,
            cartId: nuevoCarrito._id,
            password: createHash(password),
            role: role || "user",
          });

          logger.info(newUser, "nuevo usuario creado con contraseña hasheada");
          return done(null, newUser);
        } catch (e) {
          done(e);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "correo",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ correo: username });
          logger.info(user);

          if (!user) {
            return done(null, false);
          }

          if (!isValidPassword(password, user.password)) {
            return done(null, false);
          }
          await userModel.findByIdAndUpdate(user._id, {
            lastLogin: Date.now(),
          });
          return done(null, user);
        } catch (e) {
          done(e);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: data.github_client_id,
        clientSecret: data.github_secret,
        callbackURL: data.github_callbacckUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const correo = profile._json.email;
          const user = await userModel.findOne({ correo });
          if (!user) {
            const newUser = await userModel.create({
              correo,
              nombre: profile._json.name,
              apellido: "a",
              password: "a",
              edad: 18,
            });
            return done(null, newUser);
          }

          return done(null, user);
        } catch (e) {
          done(e, false);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
        ]),
        secretOrKey: "CODER_SUPER_SECRETO",
      },
      (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error, false, { message: "usuario no creado" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id: id });
    done(null, user);
  });
}

function cookieExtractor(req) {
  return req?.cookies?.["AUTH"];
}
