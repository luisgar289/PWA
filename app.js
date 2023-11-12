const guardarDatos = {
    nombre: "Luis",
    edad: 22,
    correo: null,
    telefono: 1234567890,
  }
  
  localStorage.setItem("datos", JSON.stringify(guardarDatos));
  
  console.log(JSON.parse(localStorage.getItem("datos")));