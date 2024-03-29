import { Server } from "socket.io";
export let socketServer;
import chatManager from "../dao/chats.manager.js";
import logger from "../classes/logs/winston-logger.js";

export default function configureSocket(httpServer) {
  socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    socket.on("nuevaConexion", (data) => {
      logger.info("Nueva conexion:", data);
    });

    socket.on("message", async (data) => {
      await chatManager.save(data);
      const mensajes = await chatManager.getAll();
      socketServer.emit("messageLogs", mensajes);
    });

    socket.on("newUser", async (data) => {
      const mensajes = await chatManager.getAll();
      socket.emit("messageLogs", mensajes);
      socket.broadcast.emit("userConnected", data);
    });
  });
}
