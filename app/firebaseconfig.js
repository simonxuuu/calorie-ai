import {initializeApp} from 'firebase/app';
import { getAnalytics ,isSupported} from "firebase/analytics";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  ,GoogleAuthProvider, signInWithPopup, getRedirectResult } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlQRO24LXaJwU5RnAsZyuQ0qzdYVVeTAo",
    authDomain: "calorieai-5f70c.firebaseapp.com",
    projectId: "calorieai-5f70c",
    storageBucket: "calorieai-5f70c.appspot.com",
    messagingSenderId: "218239726461",
    appId: "1:218239726461:web:ab7c2fe9a3fb4197229214",
    measurementId: "G-H02N8S7G8E"
  };

let analytics;
async function initializeAnalytics() {
    if (typeof window !== 'undefined' && await isSupported()) {
        analytics = getAnalytics(app);
    }
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
initializeAnalytics();

const provider = new GoogleAuthProvider();
const signInWithGoogle = async() => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
        // Handle the signed-in user info
      } catch (error) {
        return "Error logging in with Google."
        console.error('Error during sign-in: ', error);
      }
};


export { auth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,signInWithGoogle};