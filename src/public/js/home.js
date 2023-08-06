async function login(event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const correo = document.getElementById("correo").value;

  const response = await api.post("/api/auth/login", { correo, password });
}

async function registro(event) {
  event.preventDefault();

  window.location.href = "/registro";
}

async function recuperar() {
  event.preventDefault();

  window.location.href = `/recuperarContrasena`;
}

async function enviarCorreo() {
  event.preventDefault();

  const correo = document.getElementById("correo").value;


  await fetch(`/api/auth/recuperarPass/${correo}`, { method: "GET" });
}

async function cambiarpass() {
  event.preventDefault();
  const currentUrl = window.location.href;
  const parsedUrl = new URL(currentUrl);

  const pathname = parsedUrl.pathname;

  const nuevaClave = document.getElementById("nuevaPass").value;
  const token = pathname.slice(pathname.lastIndexOf("/") + 1);

  if (!nuevaClave || nuevaClave === "") {
    alert('Completar todos los campos')
  }else{
    await fetch(`/api/auth/modificarClave/${token}/${nuevaClave}`, {
      method: "PUT",
    });
  }
}
