import firebase from "firebase/compat/app"; /* Paquete de firebase que hay que descargar (npm i firebase) */
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKJsvKbvRvMwyLOEadOPZD2OjHO7X0TCM",
  authDomain: "login-system-f6cc2.firebaseapp.com",
  projectId: "login-system-f6cc2",
  storageBucket: "login-system-f6cc2.appspot.com",
  messagingSenderId: "777499940702",
  appId: "1:777499940702:web:4bb409a299aa988812a1cf"
};

/* Firebase nos da un objeto con todas las "llaves" para conectar nuestro proyecto de React (2:38:30) */

const firebaseApp = firebase.initializeApp(firebaseConfig); /* Iniciamos el App con Firebase */

const auth = firebase.auth(); /* Iniciamos la autentificación, hay que activar la autentificación elegida previamente en firebase */

const provider = new firebase.auth.GoogleAuthProvider(); /* Iniciamos el provider, este es un objeto de Google que nos permite negar el acceso a un usuario que no ha escrito de forma correcta o que no esté registrada su cuenta de google */

const db = firebaseApp.firestore(); /* db usa firebaseapp (ya inicializada) y accede al método firestore el cual inicia la base de datos Firestore */

export {auth, provider, db}; /* Estos objetos lo usaremos en nuestro componente Login.js */