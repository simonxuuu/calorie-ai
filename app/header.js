'use client'
import { useRouter } from 'next/navigation';

export default function Header() {

    const router = useRouter();

    return (
      <header>
        <button id='headerTitle' onClick={()=>{router.push('/');}}>Calorie AI</button>
        <div style={{gap:'1.5em',display:'flex'}}>
        <button className='headerBtn'>Test</button>
        <button className='headerBtn'>Test</button>
        <button className='headerBtn'>Test</button>
        </div>
        <button className='loginBtn'>Login</button>
      </header>
    );
  }
  