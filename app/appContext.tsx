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
      
      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          jwt: session.access_token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          console.log(res);
          console.log("Logged in Successfully. ");
        })
        .catch((e) => {
          console.error(e);
        });



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
