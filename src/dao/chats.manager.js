import { MongoManager } from "./mongo.manager.js";
import chatModel from "../models/chat.model.js";



class ChatManager{
    
    #persistencia;

    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async getAll(){
        return await this.#persistencia.getAll();
    }

    async save(chat){
        return await this.#persistencia.create(chat);
    }
    
}

const instancia = new ChatManager(new MongoManager(chatModel));
export default instancia;