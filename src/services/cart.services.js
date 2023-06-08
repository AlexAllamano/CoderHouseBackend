import data from "../data.js";
import nodemailer from 'nodemailer';
import carritoModel from "../models/cart.model.js";
import logger from "../classes/logs/winston-logger.js";

class CarritoService {
  #model;
  constructor() {
    this.#model = carritoModel;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async find() {
    return this.#model.paginate();
  }

  async findOne(cid) {
    return this.#model
      .findOne({ _id: cid })
      .populate("products.product")
      .lean();
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

  async enviarTicketEmail(correo) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "alexallamano@gmail.com",
        pass: data.CLAVE_GMAIL,
      },
    });

    transporter
      .sendMail({
        from: "'CoderHouse Backend' <proyecto@coderhouse.com>",
        to: correo,
        subject: "Compra completada",
        html: `
        <h1>Gracias por comprar</h1>
        <h2>Estamos preparando tu compra</h2>
        <h2>Para hacer un seguimiento, puede hacerlo desde su perfil</h2>
        <a href="http://localhost:8080/login">Ingresar</a>        
      `,
      })
      .then((info) => {logger.info(info, 'Correo enviado')})
      .catch((error) => logger.error(error));
  }
}

export default CarritoService;
