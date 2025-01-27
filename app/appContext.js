// app/appContext.js
"use client";
import React, { useEffect, createContext, useState } from "react";
import supabase from "./supabaseClient";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);
  const [isAuthButton, setIsAuthButton] = useState(false);

  useEffect(() => {
    const session = supabase.auth.session();
    if (session) {
      setLoggedIn(true);
      setUid(session.user.id);
    } else {
      console.log("Not logged in.");
      setLoggedIn(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setLoggedIn(true);
        setUid(session.user.id);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  async function loginAccountWithGoogle() {
    if (isAuthButton) return;
    setIsAuthButton(true);
    const { user, error } = await supabase.auth.signIn({
      provider: 'google',
    });
    if (error) {
      console.error('Error during sign-in: ', error);
      setIsAuthButton(false);
      return "Error logging in with Google.";
    } else {
      setIsAuthButton(false);
      return "Success!";
    }
  }

  return (
    <AppContext.Provider value={{ loggedIn, loginAccountWithGoogle }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };