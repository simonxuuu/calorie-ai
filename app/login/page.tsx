'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "../supabaseClient";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
        router.push("/track");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='loginPage'>
      <h1 className="subHeading">Login to save your scans!</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleLogin} className="loginForm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="loginButton"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}