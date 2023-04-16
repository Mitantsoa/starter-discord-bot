const fb = require("firebase/app");
const {getFirestore, collection, getDocs} = require("firebase/firestore")
const app = fb.initializeApp({
     apiKey: "AIzaSyANJWvbEgIseJywTm5LrV868qyTh8oC-So",
     authDomain: "utalkbot.firebaseapp.com",
     databaseURL: "https://utalkbot-default-rtdb.firebaseio.com",
     projectId: "utalkbot",
     storageBucket: "utalkbot.appspot.com",
     messagingSenderId: "47460359069",
     appId: "1:47460359069:web:b506eb515b75d8d83c2d74"
})

const db = getFirestore(app);
module.exports = db;