// app/appContext.js
"use client";
import React, { useEffect, createContext, useState } from "react";
import supabase from "./supabaseClient";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  return (
    <AppContext.Provider value={{ loggedIn }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };