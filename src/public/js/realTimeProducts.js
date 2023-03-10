const socket = io();
socket.emit("nuevaConexion", "Conexión establecida");

socket.on("mensajePost", (data) => {
  actualizarTabla(data);
});

socket.on("mensajeDelete", (data) => {
  actualizarTabla(data);
});

const url = "http://localhost:8080/api/product";

postProduct = () => {
  event.preventDefault(true);

  let objeto = {
    title: document.getElementById("titulo").value,
    description: document.getElementById("descripcion").value,
    price: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
    code: document.getElementById("codigo").value,
    status: document.getElementById("estado").checked,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objeto),
  });
};

deleteProduct = () => {
  let id = document.getElementById("id").value;

  fetch(url + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

saludar = () => {};

actualizarTabla = (data) => {
  const tbody = document.querySelector("#tablaProductos tbody");

  tbody.innerHTML = "";

  data.forEach((item) => {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = item.id;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.title;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.description;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.price;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.code;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.stock;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = item.status;
    tr.appendChild(td);
    tbody.appendChild(tr);
  });

}