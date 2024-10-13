"use client";
import React, { useEffect, createContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signInWithGoogle
} from "./firebaseconfig";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [loggedIn,setLoggedIn]= useState(false);
  const [uid,setUid] = useState(null);
  const [isAuthButton,setIsAuthButton] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUid(user.uid);
      } else {
        console.log("Not logged in.");
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

 
  function loginAccountWithGoogle(){
    if(isAuthButton) return;
    setIsAuthButton(true);
    return signInWithGoogle().then(async(res) =>{
      if(res == "Error logging in with Google."){
        return res;
      }else{
        setIsAuthButton(false);
        return "Success!";
      }
    });
  }
  return (
    <AppContext.Provider value={
        { loggedIn,
           loginAccountWithGoogle
        }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
