// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAF2N1n5ovXs8tzI-qEik6cGWd04IrIoHI",

  authDomain: "tpf-lab4-9d527.firebaseapp.com",

  projectId: "tpf-lab4-9d527",

  storageBucket: "tpf-lab4-9d527.firebasestorage.app",

  messagingSenderId: "506155156471",

  appId: "1:506155156471:web:8d92ef79e093406e9824f2",

  measurementId: "G-K8C2MNPS81"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app)

const auth = getAuth();

const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 
const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }
 
onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);

        // Pobierz dane użytkownika
        const displayName = user.displayName || "";
        const email = user.email || "";

        // Rozdziel imię i nazwisko (jeśli możliwe)
        const [firstName, ...lastNameParts] = displayName.split(" ");
        const lastName = lastNameParts.join(" ");

        // Uzupełnij pola formularza
        document.querySelector("#firstName").value = firstName || "";
        document.querySelector("#lastName").value = lastName || "";
        document.querySelector("#exampleInputEmail1").value = email || "";
    }
});

 signInButton.addEventListener("click", userSignIn);
 signOutButton.addEventListener("click", userSignOut);