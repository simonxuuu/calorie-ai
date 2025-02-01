"use client";
import React, { useEffect, createContext, useState, useContext } from "react";
import supabase from "@/app/supabaseClient";

interface AppContextType {
    loggedIn: boolean | undefined;
    userEmail: string | undefined;
    jwt: string | undefined;
    updateUserSession: () => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState<AppContextType['loggedIn']> (false);
  const [userEmail, setUserEmail] = useState<AppContextType['userEmail']> (undefined);
  const [jwt, setJWT] = useState<AppContextType['jwt']> (undefined);
  
  const updateUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      setLoggedIn(true);
      setUserEmail(session.user.email);
      setJWT(session.access_token);
      await fetch(`/api/login/?jwt=${encodeURIComponent(session.access_token)}`, {
        method: "GET",
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
      setUserEmail(undefined);
      setJWT(undefined);
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
const useAppContext = () => useContext(AppContext); //hook
export  { useAppContext, AppProvider };
