'use client'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
export default function Header() {

    const router = useRouter();

    return (
      <header>
        <div style={{display: 'flex',
  alignItems: 'center',
  gap:'0.3em',justifyContent:'center'}}>
        <button id='headerTitle' onClick={()=>{router.push('/');}}>Calorie AI </button>
        <Image
          className="logo"
          width={30}
          height={30}
          alt="food"
          src={"/favicon.ico"}
        />
        </div>
        <div style={{gap:'1.5em',display:'flex'}}>
        <button onClick={()=>{document.getElementById("landing0").scrollIntoView({block: "center"}); }}className='headerBtn'>Why us</button> 
        <button onClick={()=>{document.getElementById("landing1").scrollIntoView({block: "center"}); }}className='headerBtn'>Clarity</button>
        <button onClick={()=>{document.getElementById("landing3").scrollIntoView({block: "center"}); }}className='headerBtn' >Insights</button>
        </div>
        <button className='loginBtn'>Get Started</button>
      </header>
    );
  }
  