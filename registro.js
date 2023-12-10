import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
let usernameExists = [];
let usuarioExistente = false;

document.addEventListener('DOMContentLoaded', () => {
    getUsers();
});

function getUsers() {
    const usuariosRef = ref(db, 'usuarios/');
    get(usuariosRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
                usernameExists.push(data[key].usuario);
            }
            console.log(usernameExists);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

btnLogin.addEventListener('click', () => {
    getUsers();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    for (let i = 0; i < usernameExists.length; i++) {
        if (usernameExists[i] === username) {
          usuarioExistente = true;
        }else{
          usuarioExistente = false;
        }
      }
    if (usuarioExistente === true) {
        document.getElementById('error').style.opacity = '1';
        document.getElementById('error').style.fontSize = '15px';
        document.getElementById('error').style.color = 'red';
        document.getElementById('error').innerHTML = 'El nombre de usuario ya existe';
    } else if (username == '' || password == '' || email == '' && usuarioExistente === false) {
        document.getElementById('error').style.opacity = '1';
        document.getElementById('error').style.fontSize = '15px';
        document.getElementById('error').style.color = 'red';
        document.getElementById('error').innerHTML = 'Por favor, llene todos los campos';
    } else if (password != confirmPassword && usuarioExistente === false) {
        document.getElementById('error').style.opacity = '1';
        document.getElementById('error').style.fontSize = '15px';
        document.getElementById('error').style.color = 'red';
        document.getElementById('error').innerHTML = 'Las contraseñas no coinciden';
    } else if(usuarioExistente === false) {
        document.getElementById('error').style.opacity = '0';
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user.uid);
                //agregar a la base de datos
                set(ref(db, 'usuarios/' + user.uid), {
                    correo: email,
                    usuario: username,
                    nivel: 1,
                    equipo: "",
                });
                console.log('Usuario creado');
                window.location.href = './index.html';
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(error.message);
                if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = 'El correo ya está en uso';
                }
                else if (errorMessage == 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = 'La contraseña debe tener mínimo 6 caracteres';
                }
                else {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = error.message;
                }
            });
    }
});