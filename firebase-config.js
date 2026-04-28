const firebaseConfig = {
    apiKey: "AIzaSyCUtp75Q6HWBoVM5yt8FYXo9Ok2P0pSRxw",
    authDomain: "devcore-41f88.firebaseapp.com",
    databaseURL: "https://devcore-41f88-default-rtdb.firebaseio.com",
    projectId: "devcore-41f88",
    storageBucket: "devcore-41f88.firebasestorage.app",
    messagingSenderId: "225328867600",
    appId: "1:225328867600:web:11f248195699641ba59d95",
    measurementId: "G-QEX2DL4E0S"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();