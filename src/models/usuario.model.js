import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  edad: { type: Number, required: true },
  password: { type: String, required: true },
  cartId: { type: Schema.Types.ObjectId, ref: "carritos", required: true },
  role: { type: String, enum: ["user", "admin", "premium"], default: "user" },
});

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;
