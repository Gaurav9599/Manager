import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

//For Firebase JS SDK v7.20.0 and later, measurementId is optional
var config = {
    apiKey: "AIzaSyByDgLLYx2IysetXFYgd_lXYlC26pZW7rg",
    authDomain: "employee-6ca63.firebaseapp.com",
    projectId: "employee-6ca63",
    storageBucket: "employee-6ca63.appspot.com",
    messagingSenderId: "511816907078",
    appId: "1:511816907078:web:b923ceb69031c1869c0d47"
  };
  

firebase.initializeApp(config);

//exporting the firestore instance will let you use it to query the database.
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const app = firebase;
