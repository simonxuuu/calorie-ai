"use client";
import { useState } from "react";
import supabase from "../supabaseClient";
import { useAppContext } from "../appContext";

export default function Home() {
  const { userEmail, jwt, updateUserSession } = useAppContext()!;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const form = event.target;
      const email = form.elements.email.value;
      const password = form.elements.password.value;
      await loginUser({email,password})
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
           redirectTo : "http://localhost:3000/testAuthFuncs"
          },
      });
      if (error) console.error(error);

    }catch{}
  };
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      updateUserSession();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const registerUser = async ({email, password} : {email:string; password:string;}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) console.error(error);

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        jwt: data.session?.access_token,
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
        console.log("Registered Successfully. ");
        updateUserSession();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const loginUser = async ({email,password} : {email:string;password:string;}) => {
    const {error } = await supabase.auth.signInWithPassword({email,password});
    if (error) console.error(error);

    updateUserSession();
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = event.target;
      const email = form.elements.email.value;
      const password = form.elements.password.value;
      
      await registerUser({email, password});
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="loginPage">
      <h1 className="subHeading">cur User: {userEmail ?? "not logged in"}</h1>
      <h1 className="subHeading">jwt: {jwt ? "no exist" : "exist"}</h1>
      
      <h1 className="subHeading">Create an account!</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleRegister} className="loginForm">
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <button type="submit" className="loginButton" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <h1 className="subHeading">Login to save your scans!</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleLogin} className="loginForm">
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <button type="submit" className="loginButton" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button onClick={handleLogout}>sign out</button>
    <button onClick={handleGoogleLogin}>sign in google</button>
    </main>
  );
}
