import { MongoManager } from "./mongo.manager.js";
import productoModel from "../models/producto.model.js";

class ProductoManager {
  #persistencia;

  constructor(persistencia) {
    this.#persistencia = persistencia;
  }

  async getAll(limite = 5, page = 1, sort = -1, query = {}) {
    return await productoModel.paginate(
      {},
      { page: page, limit: limite, lean: true, sort: { price: sort } }
    );
  }

  async getById(pid) {
    return await this.#persistencia.getById(pid);
  }

  async getByCode(code) {
    return await this.#persistencia.getByCode(code);
  }

  async save(producto) {
    console.log(producto);
    return await this.#persistencia.create(producto);
  }

  async update(pid, producto) {
    return await this.#persistencia.updateOne({ _id: pid }, producto);
  }

  async delete(pid) {
    return await this.#persistencia.deleteOne(pid);
  }
}

const instancia = new ProductoManager(new MongoManager(productoModel));
export default instancia;
