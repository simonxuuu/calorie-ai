// app/appContext.js
"use client";
import React, { useEffect, createContext, useState } from "react";
import supabase from "./supabaseClient";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userID, setUserID] = useState(null);

  const updateSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setLoggedIn(true);
      setUserEmail(session.user.email);
      setUserID(session.user.id);
    } else {
      setLoggedIn(false);
      setUserEmail(null);
      setUserID(null);
    }
  };

  useEffect(() => {
    updateSession(); // Call async fetch auth on load
  }, []);

  return (
    <AppContext.Provider value={{
       loggedIn,
       userEmail,
       userID,
       updateSession }}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppProvider };
