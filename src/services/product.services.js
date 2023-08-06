import productoModel from "../models/producto.model.js";
import data from "../data.js";
import nodemailer from "nodemailer";
import logger from "../classes/logs/winston-logger.js";

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

  async enviarCorreoProductoEliminado(correo, descripcion) {
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
        to: "alexisallamano@hotmail.com",
        subject: "Producto eliminado",
        html: `
        <h1>Confirmamos la eliminación del producto ${descripcion}</h1>
        <h2>Si no fuiste vos, contactar al admin</h2>
      `,
      })
      .then((info) => {
        logger.info(info, "Correo enviado");
        console.log(`CORREO ENVIADO A ${correo}`);
      })
      .catch((error) => {
        logger.error(error);
        console.log(error);
      });
  }

  prueba(correo, descripcion) {
    console.log(correo);
    console.log(descripcion);
  }
}

export default ProductoService;
