import productoModel from "../models/producto.model.js";

class ProductoService {
  #model;
  constructor() {
    this.#model = productoModel;
  }

  async create(data) {
    return this.#model.create(data);
  }
  async find() {
    return this.#model.find();
  }
  async paginate(condiciones, opciones) {
    return this.#model.paginate(condiciones, opciones);
  }

  async findById(id) {
    return this.#model.findById(id);
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, data);
    const updatedData = await this.findById(id);
    return updatedData;
  }

  async delete(id) {
    await this.#model.findByIdAndDelete(id);
  }
}

export default ProductoService;
