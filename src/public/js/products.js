const query = new URLSearchParams(window.location.search);

setNext = () => {
  let nextPage = parseInt(query.get("page")) + 1;
  if(isNaN(nextPage)){
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
  let sort = parseInt(document.getElementById("sort").options[document.getElementById("sort").selectedIndex].value);
  let descrpcion = document.getElementById("descrpcion").value;

  if(!isNaN(limite)){
    query.set("limite", limite);
  }
  if(!isNaN(pagina)){
    query.set("page", pagina);
  }

  if(descrpcion!=''){
    query.set("descrpcion", descrpcion);
  }
  
  query.set("sort", sort);
 
  window.location.search = query.toString();

  console.log(sort);
};
