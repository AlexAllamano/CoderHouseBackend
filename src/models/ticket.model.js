import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema } from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4(),
  },
  fechayhora: {
    type: Date,
    default: Date.now,
  },
  monto: {
    type: Number,
    required: true,
  },
  comprador: {
    type: String,
    required: true,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "carritos",
    required: true,
  },
  productos: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "productos",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;
