async function login(event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const correo = document.getElementById("correo").value;

  const response = api.post('/api/auth/login', {correo, password});
}
