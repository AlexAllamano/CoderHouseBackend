import  { Router } from "express";
import productoRoute from "./productos.route.js";
import usuarioRoute from './usuarios.router.js';
import authRoute from "./auth.router.js";
import cartRoute from "./carts.route.js";
import jwtrouter from "./jwt.router.js";


const route = Router();


route.use(productoRoute.path, productoRoute.router);
route.use(usuarioRoute.path, usuarioRoute.router);
route.use(authRoute.path, authRoute.router);
route.use(cartRoute.path, cartRoute.router);
route.use(jwtrouter.path, jwtrouter.router);

export default route;