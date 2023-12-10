import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjtuh2EbUzYm4kOrgWjyGjIEeDf5KpkR4",
    authDomain: "appfinal-99970.firebaseapp.com",
    databaseURL: "https://appfinal-99970-default-rtdb.firebaseio.com",
    projectId: "appfinal-99970",
    storageBucket: "appfinal-99970.appspot.com",
    messagingSenderId: "32119081460",
    appId: "1:32119081460:web:c052963ca533de3b9f51a1"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();
let cookie = "";
var data = {};
let userId = [];

document.addEventListener('DOMContentLoaded', () => {
    cookie = document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1];
    console.log(cookie);
    getId().then(() => {
        const cookieFound = userId.includes(cookie);
        console.log(cookieFound);
        //remover por problemas de CORS
        /*if (cookieFound === false) {
            window.location.href = "./index.html";
            document.cookie = "user= null";
        } else {
            getData().then(() => {
                niveles();
            });
        }*/
        getData().then(() => {
            niveles();
        });
    });
});

function getId() {
    return new Promise((resolve, reject) => {
        const usuariosRef = ref(db, 'usuarios/');
        get(usuariosRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    userId.push(childSnapshot.key);
                });
                resolve(); // Resolvemos la promesa aquí
            } else {
                console.log("No data available");
                reject("No data available"); // Rechazamos la promesa en caso de no haber datos
            }
        }).catch((error) => {
            console.error(error);
            reject(error); // Rechazamos la promesa en caso de error
        });
    });

}

function getData() {
    return new Promise((resolve, reject) => {
        const usuariosRef = ref(db, 'usuarios/' + cookie + '/');
        get(usuariosRef).then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                if (data.equipo === "") {
                    document.getElementById('equipo').innerHTML = 'Unirse a un equipo';
                } else if (data.equipo === "invitado") {
                    document.getElementById('equipo').id = 'no-disponible';
                    document.getElementById('no-disponible').innerHTML = 'Equipos deshabilitados';
                }
                else {
                    document.getElementById('equipo').innerHTML = 'Salir del equipo';
                }
                resolve(); // Resolvemos la promesa aquí
            } else {
                console.log("No data available");
                reject("No data available"); // Rechazamos la promesa en caso de no haber datos
            }
        }).catch((error) => {
            console.error(error);
            reject(error); // Rechazamos la promesa en caso de error
        });
    });
}

function niveles() {
    document.getElementById('continuar').style.opacity = 0;
    const nivel = data.nivel;
    if (nivel === 1) {
        document.getElementById('contenedor').innerHTML = `
        <div class="main-container">
            <h1 class="titulo">Juego del ahorcado</h1>
            <h1 id="msg-final"></h1>
            <h3 id="acierto"></h3>
            <div class="flex-row no-wrap">
              <h2 class="palabra" id="palabra"></h2>
              <picture>
                <img src="img/ahorcado_6.jpeg" alt="" id="image6">
                <img src="img/ahorcado_5.jpeg" alt="" id="image5">
                <img src="img/ahorcado_4.jpeg" alt="" id="image4">
                <img src="img/ahorcado_3.jpeg" alt="" id="image3">
                <img src="img/ahorcado_2.jpeg" alt="" id="image2">
                <img src="img/ahorcado_1.jpeg" alt="" id="image1">
                <img src="img/ahorcado_0.jpeg" alt="" id="image0">
              </picture>
            </div>
            <div class="flex-row" id="turnos">
              <div class="col">
                <h3>Intentos restantes: <span id="intentos">6</span></h3>
              </div>
              <div class="col">
                <button onclick="inicio()" id="reset">Elegir otra palabra</button>
                <button onclick="pista()" id="pista">Dame una pista!</button>
                <span id="hueco-pista"></span>
              </div>
              </div>
            <div class="flex-row">
              <div class="col">
                <div class="flex-row" id="abcdario">
                </div>
              </div>
              <div class="col"></div>
            </div>
          </div>
        `;
        var scriptElement = document.createElement('script');

        // Establecer la fuente del script
        scriptElement.src = './ahorcado.js';

        // Añadir el script al final del cuerpo del documento
        document.body.appendChild(scriptElement);
    }
}

function perfil() {
    const contenedor = document.getElementById('contenedor');
    document.getElementById('continuar').style.opacity = 1;
    contenedor.innerHTML = "";
    // Crear elementos
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    const h3 = document.createElement('h3');
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    // Añadir clases
    div.classList.add('main-container');
    h1.classList.add('titulo');
    // Añadir texto
    h1.textContent = 'Perfil';
    h2.textContent = 'Usuario: ' + data.usuario;
    h3.textContent = 'Correo Electrónico: ' + data.correo;
    h4.textContent = 'Nivel: ' + data.nivel;
    p.textContent = 'Equipo: ' + data.equipo;
    // Añadir elementos al contenedor
    div.appendChild(h1);
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(p);
    // Añadir el contenedor al elemento con ID 'contenedor'
    contenedor.appendChild(div);

}

document.getElementById('salir').addEventListener('click', () => {
    signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    document.cookie = "user= null";
    window.location.href = "index.html";
});

document.getElementById('equipo').addEventListener('click', () => {
    document.getElementById('contenedor').innerHTML = "";
    document.getElementById('continuar').style.opacity = 1;
    if (cookie === "invitado") {
        alert('Los equipos están deshabilitados para los usuarios invitados');
        niveles();
    }
    else {
        if (data.equipo === "") {
            let nombreEquipo = [];
            const usuariosRef = ref(db, 'usuarios/' + cookie + '/');
            const equipoRef = ref(db, 'equipos/');
            get(equipoRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        nombreEquipo.push(childSnapshot.key);
                    });
                    console.log(nombreEquipo);
                    const div = document.createElement('select');
                    for (let i = 0; i < nombreEquipo.length; i++) {
                        const option = document.createElement('option');
                        option.value = nombreEquipo[i];
                        option.textContent = nombreEquipo[i];
                        div.appendChild(option);
                    }
                    const titulo = document.createElement('h1');
                    titulo.textContent = 'Elige un equipo';
                    titulo.style.textAlign = 'center';
                    document.getElementById('contenedor').appendChild(titulo);
                    div.style.margin = 'auto';
                    div.style.display = 'block';
                    div.style.marginBottom = '20px';
                    div.style.marginTop = '20px';
                    document.getElementById('contenedor').appendChild(div);
                    const button = document.createElement('button');
                    button.textContent = 'Unirse';
                    button.style.margin = 'auto';
                    button.style.display = 'block';
                    button.style.marginBottom = '20px';
                    button.style.marginTop = '20px';
                    document.getElementById('contenedor').appendChild(button);
                    button.addEventListener('click', () => {
                        update(usuariosRef, {
                            equipo: div.value
                        });
                        update(equipoRef, {
                            [div.value]: {
                                integrantes: {
                                    usuario: data.usuario
                                }
                            }
                        });
                        window.location.href = "./main.html";
                    });
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            const usuariosRef = ref(db, 'usuarios/' + cookie + '/');
            update(usuariosRef, {
                equipo: ""
            });
            window.location.href = "./main.html";
        }
    }
});

document.getElementById('perfil').addEventListener('click', () => {
    perfil();
});

document.getElementById('continuar').addEventListener('click', () => {
    niveles();
});

document.getElementById('no-disponible').addEventListener('click', () => {
    alert('Los equipos están deshabilitados para los usuarios invitados');
}
);