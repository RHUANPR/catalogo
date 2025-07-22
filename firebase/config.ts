import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// TODO: Cole a configuração do seu projeto Firebase aqui.
// Você pode encontrar isso no console do Firebase, nas configurações do seu projeto da web.
const firebaseConfig = {
  apiKey: "AIzaSyBMrLjLEbeLIvYNmcFybK0oF4WfwNiPtkQ",
  authDomain: "catalogopetshop-b1028.firebaseapp.com",
  projectId: "catalogopetshop-b1028",
  storageBucket: "catalogopetshop-b1028.appspot.com",
  messagingSenderId: "67040728513",
  appId: "1:67040728513:web:bc7448e9e86ce33cc94b40",
  measurementId: "G-S53SPRBZKF"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();

export { db, storage };
