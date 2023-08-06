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
  await api.post(`cart/${cartId}/product/${id}`);

  alert("Producto agregado");
};

async function logout(event) {
  event.preventDefault();

  await fetch("/logout", { method: "GET" }).then(res =>{
    window.location.href = `/`
  });
}

comprar = async (element) => {
  const cartId = element.getAttribute("cart-id");
  const currentUrl = window.location.href;
  const parsedUrl = new URL(currentUrl);
  console.log(parsedUrl.origin)
  await fetch(`${origin}/api/cart/${cartId}/comprar`, {
    method: "POST",
  }).then((response) => {
    if (response.status == 201) {
      alert("Compra realizada... enviando email");

      location.reload();
    }
  });
};

async function verListaUsuarios() {
  window.location.href = `/listaUsuarios`;
}

async function crearProducto() {
  window.location.href = "/api/crearProducto";
}

async function borrarProducto(element) {
  const id = element.getAttribute("data-id");

  await fetch(`/api/product/${id}`, {
    method: "DELETE",
  }).then((respuesta) => {
    if (respuesta.status == 200) {
      location.reload();
    }
  });
}

async function cambiarRole(element) {
  const correo = element.getAttribute("correo");

  await fetch(`/api/usuarios/cambiarRole/${correo}`, {
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

  await fetch(`/api/usuarios/${correo}`, {
    method: "DELETE",
  }).then((data) => {
    alert("Usuario borrado");
    location.reload();
  });
}

async function borrarusuariosInactivos() {
  await fetch(`/api/usuarios/usuariosInactivos`, {
    method: "DELETE",
  }).then((data) => {
    alert("Usuarios borrados");
    location.reload();
  });
}


async function verCarrito(element) {
  let cid = element.getAttribute("cart-id");
  window.location.href = `/api/carts/${cid}`;
}
