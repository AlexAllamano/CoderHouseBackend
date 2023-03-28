import mongoose from "mongoose";

const chatCollection = "mensajes";



const chatSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  }
  
});

const chatModel = mongoose.model(chatCollection, chatSchema);
export default chatModel;