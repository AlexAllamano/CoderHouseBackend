import { MongoManager } from "./mongo.manager.js";
import productoModel from "../models/producto.model.js";

class ProductoManager{
    
    #persistencia;

    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async getAll(){
        return await this.#persistencia.getAll();
    }

    async getById(pid){
        return await this.#persistencia.getById(pid);
    }


    async save(producto){
        return await this.#persistencia.create(producto);
    }

    async update(pid, producto){
        return await this.#persistencia.updateOne({_id:pid}, producto);
    }

    async delete(pid){
        return await this.#persistencia.deleteOne(pid);
    }
}

const instancia = new ProductoManager(new MongoManager(productoModel));
export default instancia;