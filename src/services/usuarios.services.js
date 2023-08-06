import userModel from "../models/usuario.model.js";
import data from "../data.js";
import logger from "../classes/logs/winston-logger.js";
import nodemailer from "nodemailer";

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
    return this.#model.findOne({ _id: usuario }).populate("cartId");
  }

  async findByCorreo(correo) {
    return this.#model.findOne({ correo: correo }).populate("cartId");
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

  async deleteByCorreo(correo) {
    await this.#model.findOneAndRemove({ correo });
  }

  async getUsuariosInactivos() {
    const dosDiasAtras = new Date().getDate() - 2;
    return await this.#model.find({ lastLogin: { $lt: dosDiasAtras } });
  }

  async findByCartId(carrito) {
    return this.#model.findOne({ cartId: carrito }).populate("cartId");
  }

  async enviarCorreoUsuarioEliminado(correo) {
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
        subject: "Usuario eliminado",
        html: `
        <h1>Hemos eliminado su usuario debido a inactividad</h1>
        <h2>Por haber estado más de dos días sin iniciar sesión, hemos borrado sus registros</h2>
      `,
      })
      .then((info) => {
        logger.info(info, "Correo enviado");
      })
      .catch((error) => logger.error(error));
  }
}

export default UsuarioService;
