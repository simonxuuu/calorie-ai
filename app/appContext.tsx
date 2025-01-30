"use client";
import React, { useEffect, createContext, useState } from "react";
import supabase from "@/app/supabaseClient";

interface AppContextType {
    loggedIn: boolean;
    userEmail: string | null;
    jwt: string | null;
    updateUserSession: () => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [jwt, setJWT] = useState(null);
  
  const updateUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      setLoggedIn(true);
      setUserEmail(session.user.email);
      setJWT(session.access_token);

    } else {
      setLoggedIn(false);
      setUserEmail(null);
      setJWT(null);
    }
  };


  useEffect(() => {
    updateUserSession(); // Get session on load
  }, []);

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        userEmail,
        jwt,
        updateUserSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export  { AppContext, AppProvider };
