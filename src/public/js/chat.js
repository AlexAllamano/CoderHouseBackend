const socket = io();

Swal.fire({
  title: "Identificate",
  text: "Introduce tu nombre",
  input: "text",
  icon: "question",
  inputValidator: (value) => {
    return !value && "Necesitamos un nombre de usuario!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("newUser", { user });
});

let user;
const chatBox = document.querySelector("#chatBox");

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { usuario: user, mensaje: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  const log = document.querySelector("#messageLogs");
  const messages = data
    .map((message) => `${message.usuario} dice: ${message.mensaje}`)
    .join("<br/>");
  log.innerHTML = messages;
});

socket.on('userConnected', (data) =>{
    Swal.fire({
        "title":"Nuevo usuario conectado",
        "text":`${data.user} se conectó`,
        "toast":true,
        "position": "top-right"
    })
})