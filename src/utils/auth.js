import passport from "passport";
import { Strategy } from "passport-local";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        console.log({ info: info.message });
        return res.status(401).send({ error: info.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send({ error: "Usuario no logueado" });

    if (req.user.user.rol !== rol)
      return res.status(403).send({ error: "Usuario no tiene permisos" });
    next();
  };
};
