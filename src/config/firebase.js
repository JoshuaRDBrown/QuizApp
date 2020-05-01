import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCxNe5WxIgcX0gEuq48ljLJUgzZ_LFC1Q0",
  authDomain: "quiz-2663b.firebaseapp.com",
  databaseURL: "https://quiz-2663b.firebaseio.com",
  projectId: "quiz-2663b",
  storageBucket: "quiz-2663b.appspot.com",
  messagingSenderId: "891709627219",
  appId: "1:891709627219:web:7bda9566f1d5fdda405fa6",
  measurementId: "G-1CVVR6Z3ZQ"
};

const fb = firebase.initializeApp(firebaseConfig);

export default fb;
