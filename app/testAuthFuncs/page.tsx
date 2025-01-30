"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import supabase from "../supabaseClient";
import { AppContext } from "../appContext";

export default function Home() {
  const { userEmail, updateUserSession } = useContext(AppContext);
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
  const loginUser = async ({email,password} : {email:string;password:string;}) => {
    const { data, error } = await supabase.auth.signInWithPassword({email,password});
    if (error) console.error(error);

    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
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
        console.log(res);
        console.log("Logged in Successfully. ");
        updateUserSession();
      })
      .catch((e) => {
        console.error(e);
      });
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
     
    </main>
  );
}
