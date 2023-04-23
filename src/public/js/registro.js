async function registrar(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const edad = document.getElementById("edad").value;
  const password = document.getElementById("password").value;

  const response = api
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
  //   await fetch("/api/usuarios", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       nombre,
  //       apellido,
  //       correo,
  //       edad,
  //       password,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   if (response.ok) {
  //     response.json().then((d) => {
  //       alert("Todo bien");
  //     });
  //   }
}
