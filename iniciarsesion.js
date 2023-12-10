import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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
let usernameExists = [];

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

btnIngresar.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Email: ' + email + ' Password: ' + password);
    if (email == '' || password == '') {
        document.getElementById('error').style.opacity = '1';
        document.getElementById('error').style.fontSize = '15px';
        document.getElementById('error').style.color = 'red';
        document.getElementById('error').style.margin = '5px 5px';
        document.getElementById('error').innerHTML = 'Por favor, llene todos los campos';
    } else {
        document.getElementById('error').style.opacity = '0';
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user.uid);
                document.cookie = 'user=' + user.uid;
                window.location.href = './main.html';
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(error.message);
                if (errorMessage == 'Firebase: Error (auth/wrong-password).') {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = 'Contraseña incorrecta';
                }
                else if (errorMessage == 'Firebase: Error (auth/user-not-found).') {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = 'El correo no está registrado';
                }
                else {
                    document.getElementById('error').style.opacity = '1';
                    document.getElementById('error').style.fontSize = '15px';
                    document.getElementById('error').innerHTML = error.message;
                }
            });
    }

}
);
document.getElementById('guest').addEventListener('click', () => {
    document.cookie = 'user=invitado';
    window.location.href = './main.html';
});