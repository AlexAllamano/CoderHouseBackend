const query = new URLSearchParams(window.location.search);

setNext = () => {
  let nextPage = parseInt(query.get("page")) + 1;
  if (isNaN(nextPage)) {
    nextPage = 1;
  }
  query.set("page", nextPage);
  window.location.search = query.toString();
};

setPrev = () => {
  let prevPage = parseInt(query.get("page")) - 1;
  query.set("page", prevPage);
  window.location.search = query.toString();
};

filtrar = () => {
  let limite = parseInt(document.getElementById("limite").value);
  let pagina = parseInt(document.getElementById("pagina").value);
  let sort = parseInt(
    document.getElementById("sort").options[
      document.getElementById("sort").selectedIndex
    ].value
  );
  let descrpcion = document.getElementById("descrpcion").value;

  if (!isNaN(limite)) {
    query.set("limite", limite);
  }
  if (!isNaN(pagina)) {
    query.set("page", pagina);
  }

  if (descrpcion != "") {
    query.set("descrpcion", descrpcion);
  }

  query.set("sort", sort);

  window.location.search = query.toString();
};

agregarCarrito = async (element) => {
  const id = element.getAttribute("data-id");
  const cartId = document.getElementById("user-data").getAttribute("data-user");

  await fetch(`http://localhost:8080/api/cart/${cartId}/product/${id}`, {
    method: "POST",
  });

  alert("Producto agregado");
};

function logout(event) {
  event.preventDefault();
}

comprar = async () => {
  const cartId = document.getElementById("user-data").getAttribute("data-user");

  await fetch(`http://localhost:8080/api/cart/${cartId}/comprar`, {
    method: "POST",
  });

  alert("Compra realizada... enviando email");
};

async function verListaUsuarios() {
  window.location.href = "http://localhost:8080/api/listaUsuarios";
}

async function crearProducto() {
  window.location.href = "http://localhost:8080/api/crearProducto";
}

async function cambiarRole(element) {
  const correo = element.getAttribute("correo");

  await fetch(`http://localhost:8080/api/usuarios/cambiarRole/${correo}`, {
    method: "PUT",
  }).then((data) => {
    if (data.status == 200) {
      location.reload();
    } else if (data.status == 403) {
      alert("Alerta: No autorizado");
    }
  });
}

async function borrarUsuario(element) {
  const correo = element.getAttribute("correo");

  await fetch(`http://localhost:8080/api/usuarios/${correo}`, {
    method: "DELETE",
  }).then((data) => {
    alert("Usuario borrado");
    location.reload();
  });
}

async function borrarusuariosInactivos() {
  await fetch(`http://localhost:8080/api/usuarios/usuariosInactivos`, {
    method: "DELETE",
  }).then((data) => {
    alert("Usuarios borrados");
    location.reload();
  });
}

