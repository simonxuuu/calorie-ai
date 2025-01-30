"use client";
import React, { useEffect, createContext, useState } from "react";
import supabase from "./supabaseClient";

interface AppContextType {
    loggedIn: boolean;
    userEmail: string | null;
    jwt: string | null;
    registerUser: ({ email, password }: { email: string; password: string; }) => Promise<void>;
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

  const registerUser = async ({email, password} : {email:string; password:string;}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;

    await fetch("/api/dbAccess", {
      method: "POST",
      body: JSON.stringify({
        requestType: "register",
        jwt: data.session.access_token,
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
        console.log("Registered Successfully. ")
      })
      .catch((e) => {
        console.error(e);
      });
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
        registerUser,
        updateUserSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export  { AppContext, AppProvider };
