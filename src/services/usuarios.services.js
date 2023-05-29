import userModel from "../models/usuario.model.js";

class UsuarioService {
  #model;
  constructor() {
    this.#model = userModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async findById(id) {
    return this.#model.findById(id);
  }

  async findOne(usuario) {
    return this.#model.findOne({ _id: usuario }).populate('cartId');
  }

  async paginate(condiciones, opciones) {
    return this.#model.paginate(condiciones, opciones);
  }

  async update(id, data) {
    await this.#model.updateOne({ _id: id }, data);
    const updatedData = await this.findById(id);
    return updatedData;
  }

  async delete(id) {
    await this.#model.findByIdAndDelete(id);
  }

  async findByCartId(carrito) {
    return this.#model.findOne({ cartId: carrito }).populate('cartId');
  }
}

export default UsuarioService;
