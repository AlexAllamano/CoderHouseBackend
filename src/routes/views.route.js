import { Router } from "../classes/server/router.js";
import viewsController from '../controllers/views.controller.js';
class ViewsRouter extends Router{
    constructor() {
        super("/");
      }

      init(){
        this.get("/",["PUBLIC"], viewsController.getHome.bind(viewsController));
        this.get("/home",["PUBLIC"], viewsController.getHome.bind(viewsController));
        this.get("/registro",["PUBLIC"], viewsController.getRegistro.bind(viewsController));
        this.get("/realtimeproducts",["PUBLIC"], viewsController.getRealTimeProducts.bind(viewsController));
        this.get("/products",["PUBLIC"], viewsController.getProducts.bind(viewsController));
        this.get("/carts/:cid",["PUBLIC"], viewsController.getCartById.bind(viewsController));
        this.get("/chat",["PUBLIC"], viewsController.getChats.bind(viewsController));
        this.get("/listaUsuarios",["ADMIN"], viewsController.getListaUsuarios.bind(viewsController));
        this.get("/crearProducto",["ADMIN","PREMIUM"], viewsController.getCrearProducto.bind(viewsController));
    }
    
}



const router = new ViewsRouter();

export default router;
