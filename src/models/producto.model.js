import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productoCollection = "productos";

const productoSchema = new mongoose.Schema({
  tittle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
  owner: {
    type: String, 
    default: "admin",
    required: true,
  },
});
productoSchema.plugin(mongoosePaginate);
const productoModel = mongoose.model(productoCollection, productoSchema);
export default productoModel;
