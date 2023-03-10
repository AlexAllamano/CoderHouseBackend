import { Server } from "socket.io";
export let socketServer;

export default function configureSocket(httpServer) {
  socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {

    socket.on("nuevaConexion", (data) => {
      console.log("Nueva conexion:", data);
    });

   
  });

  
}
