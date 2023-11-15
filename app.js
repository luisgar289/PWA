const guardarDatos = {
    nombre: "Luis",
    edad: 22,
    correo: null,
    telefono: 1234567890,
  }
  
  localStorage.setItem("datos", JSON.stringify(guardarDatos));
  
  console.log(JSON.parse(localStorage.getItem("datos")));

  if (navigator.setAppBadge) {
    console.log("The App Badging API is supported!");
  }
  
  navigator.setAppBadge(64).then(() => {
  console.log("The badge was added");
  }).catch(e => {
  console.error("Error displaying the badge", e);
  });