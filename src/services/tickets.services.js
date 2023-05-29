import ticketModel from "../models/ticket.model.js";

class TicketService {
  #model;
  constructor() {
    this.#model = ticketModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async findById(id) {
    return this.#model.findById(id);
  }

  async findOne(ticket) {
    return this.#model.findOne({ _id: ticket });
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
}

export default TicketService;
