import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpLan2C7iEXUUk4dIJwF1J4FEr4uuybQ0",
  authDomain: "parliament-system.firebaseapp.com",
  projectId: "parliament-system",
  storageBucket: "parliament-system.firebasestorage.app",
  messagingSenderId: "909013646955",
  appId: "1:909013646955:web:eda7d890865da17d517b2e",
  measurementId: "G-W1SRJ93XJS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logoutUser = () => signOut(auth);
