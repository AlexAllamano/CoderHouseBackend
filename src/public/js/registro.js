async function registrar(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const edad = document.getElementById("edad").value;
  const password = document.getElementById("password").value;

  await api
    .post("/api/auth/register", {
      nombre,
      apellido,
      correo,
      edad,
      password,
    })
    .then((d) => {
      alert("Todo bien");
    });


}
