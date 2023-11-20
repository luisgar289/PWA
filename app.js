const guardarDatos = {
    nombre: "Luis",
    edad: 22,
    correo: null,
    telefono: 1234567890,
}
  
localStorage.setItem("datos", JSON.stringify(guardarDatos));
console.log(JSON.parse(localStorage.getItem("datos")));

//insertar un boton en el contenedor que solicite notificaciones

const button = document.getElementById('button');

button.addEventListener('click', () => {
    Notification.requestPermission()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
});

navigator.setAppBadge(42).then(() => {
  console.log("The badge was added");
}).catch(e => {
  console.error("Error displaying the badge", e);
});