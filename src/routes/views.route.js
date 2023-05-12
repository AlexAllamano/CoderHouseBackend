import { Router } from "express";
import viewsController from '../controllers/views.controller.js';

const route = Router();

route.get("/", viewsController.getHome);
route.get("/registro", viewsController.getRegistro);
route.get("/realtimeproducts", viewsController.getRealTimeProducts);
route.get("/products", viewsController.getProducts);
route.get("/carts/:cid", viewsController.getCartById);
route.get("/chat", viewsController.getChats);

export default route;
