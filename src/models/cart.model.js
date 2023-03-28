import mongoose from "mongoose";

const carritoCollection = "carritos";



const carritoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  products: {
    type: Array,
    default: [],
    required: true,
  }
  
});

const carritoModel = mongoose.model(carritoCollection, carritoSchema);
export default carritoModel;