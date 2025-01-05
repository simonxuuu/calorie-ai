'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppContext } from "../appContext";
import { useContext } from "react";
export default function Home() {

    const router = useRouter();
    const appContext = useContext(AppContext);
    
    const handleSubmitGoogle = (event) => {
        appContext.loginAccountWithGoogle(event).then((response) => {
          console.log(response);
          if (response == "Success!") {
            router.push("/track");
          }
        });
      };
    
      return (
        <main className='loginPage'>
            <h1 className="subHeading">Login for a bettter experience</h1>
          <button type="button" onClick={handleSubmitGoogle} style={{display:'flex',alignContent:'center',justifyContent:'center',fontWeight:'500'}}className="googleLogin">
            
            <img
              width="20px"
              style={{marginRight: "1em",marginTop:'0.1em' }}
              alt="Google sign-in"
              src="/google.png"
            />
            Login with Google
            
            </button>
        </main>
      );
    }


