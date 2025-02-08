"use client";
import "./auth.css";
import { useState } from "react";
import supabase from "../supabaseClient";
import Link from "next/link";
import { useAppContext } from "../appContext";

export default function Register() {
  const { userEmail, jwt, updateUserSession } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async ({email, password}) => {
    const {error} = await supabase.auth.signInWithPassword({email, password});
    if (error) console.error(error);
    updateUserSession();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const form = event.target;
      await loginUser({
        email: form.elements.email.value,
        password: form.elements.password.value
      });
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
          redirectTo: "http://localhost:3000/testAuthFuncs"
        },
      });
      if (error) console.error(error);
    } catch (error) {
      setError(error.message);
    }
  };

  const registerUser = async ({email, password}) => {
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
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      return res.json();
    })
    .then(() => {
      console.log("Registered Successfully.");
      updateUserSession();
    })
    .catch((e) => console.error(e));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const form = event.target;
      await registerUser({
        email: form.elements.email.value,
        password: form.elements.password.value
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="auth-box">
        <h1 className="auth-header">Sign into Snappit!</h1>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        {/* 
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        */}
        
        <button onClick={handleGoogleLogin} disabled={loading}>
          Login with Google
        </button>

        <div className="alt-options">
            <h2 className="alt-options-header">
                Already have an account?
                
            </h2>
            <Link className="alt-options-link" href="/login">Create new account</Link>   
            <h2 className="alt-options-header">
                Forgot your password?
                
            </h2>
            <Link className="alt-options-link" href="/login">Reset password</Link>   
        </div>
      </div>
    </main>
  );
}