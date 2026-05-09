import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// A sua configuração exata
const firebaseConfig = {
  apiKey: "AIzaSyAhzsETAh-zJ7jyvnt0Uogx5O7FRmZ6ktw",
  authDomain: "task-planner-pro-e3aa6.firebaseapp.com",
  projectId: "task-planner-pro-e3aa6",
  storageBucket: "task-planner-pro-e3aa6.firebasestorage.app",
  messagingSenderId: "846785456142",
  appId: "1:846785456142:web:74fb28d361f7d4bca6345f",
  measurementId: "G-B1D9JQN3Q3"
};

// Inicializando os serviços
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // <--- Crie o provedor aqui
export const db = getFirestore(app);