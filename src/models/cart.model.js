import mongoose from "mongoose";

const carritoCollection = "carritos";

const carritoSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productos",
        },
        quantity: Number
      },
    ],
    default: [],
    required: true,
  },
});



const carritoModel = mongoose.model(carritoCollection, carritoSchema);
export default carritoModel;
