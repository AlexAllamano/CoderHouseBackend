async function login(event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const correo = document.getElementById("correo").value;

  const response = await api.post('/api/auth/login', {correo, password});
}

async function registro(event){
  event.preventDefault();

    window.location.href = '/registro';



}
