import { Router } from "express";
import viewsController from '../controllers/views.controller.js';

const route = Router();

route.get("/", viewsController.getHome.bind(viewsController));
route.get("/registro", viewsController.getRegistro.bind(viewsController));
route.get("/realtimeproducts", viewsController.getRealTimeProducts.bind(viewsController));
route.get("/products", viewsController.getProducts.bind(viewsController));
route.get("/carts/:cid", viewsController.getCartById.bind(viewsController));
route.get("/chat", viewsController.getChats.bind(viewsController));

export default route;
