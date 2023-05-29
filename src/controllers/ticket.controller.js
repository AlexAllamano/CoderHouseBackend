import TicketService from "../services/tickets.services.js";

class TicketController {
  #ticketSercive;
  constructor(service) {
    this.#ticketSercive = service;
  }

  async create(req, res, next) {
    try {
      const { comprador, monto, productos, cartId } = req.body;

      const ticket = await this.#ticketSercive.create({
        comprador,
        monto,
        cartId,
        productos,
      });

      res.status(200).send(`Ticket creado con id ${ticket.code}`);
    } catch (e) {
      next(e);
    }
  }

  async findOne(req, res, next) {
    const { tid } = req.params;
    try {
      const ticket = await this.#ticketSercive.findOne({ _id: tid });
      res.status(200).send({ ticket });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const tickets = await this.#ticketSercive.find();
      res.status(200).send({ tickets });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { tid } = req.params;
    try {
      await this.#ticketSercive.delete({ _id: tid });
      res.status(200).send(`Ticket con id ${tid} borrado`);
    } catch (error) {
      next(error);
    }
  }

  
}

const controller = new TicketController(new TicketService());
export default controller;
