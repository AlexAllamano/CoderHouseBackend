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

    async save(producto){
        return await this.#persistencia.create(producto);
    }
}

const instancia = new CartManager(new MongoManager(carritoModel));
export default instancia;