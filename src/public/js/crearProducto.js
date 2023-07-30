async function crearProducto(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const codigo = document.getElementById("codigo").value;
  const stock = document.getElementById("stock").value;


  const usuario = document.getElementById('boton').getAttribute("usuario");

  if (
    nombre == "" ||
    descripcion == "" ||
    precio == "" ||
    codigo == "" ||
    stock == ""
  ) {
    alert("Completar todos los campos");
    return;
  } else {
    await api
      .post(`http://localhost:8080/api/product`, {
        tittle: nombre,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stock,
        usuario
      })
      .then((response) => {
        if (response.producto) {
          alert("producto creado");
        }else if(response.Error){
            alert(response.Error)
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
