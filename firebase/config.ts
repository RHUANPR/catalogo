import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBMrLjLEbeLIvYNmcFybK0oF4WfwNiPtkQ",
  authDomain: "catalogopetshop-b1028.firebaseapp.com",
  projectId: "catalogopetshop-b1028",
  storageBucket: "catalogopetshop-b1028.appspot.com",
  messagingSenderId: "67040728513",
  appId: "1:67040728513:web:bc7448e9e86ce33cc94b40",
  measurementId: "G-S53SPRBZKF"
};

let app;
// Initialize Firebase if it hasn't been already
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app(); // Get the default app if it already exists
}

// Get a Firestore instance from the app
const db = app.firestore();

export { db };