import  { Router } from "express";

import viewsRouter from "./views.route.js";


const route = Router();

route.use(viewsRouter.path, viewsRouter.router);

export default route;