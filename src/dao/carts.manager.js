import { MongoManager } from "./mongo.manager.js";
import carritoModel from "../models/cart.model.js"


class CartManager{
    #persistencia;

    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async getAll(){
        return await this.#persistencia.getAll();
    }

    async getById(cid){
        return await this.#persistencia.findOneCart(cid);
    }

    async save(productos){
        return await this.#persistencia.create(productos);
    }

    async updateOne(cid, carrito){
        return await this.#persistencia.updateOne(cid, carrito);
    }
}

const instancia = new CartManager(new MongoManager(carritoModel));
export default instancia;