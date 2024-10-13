'use client'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


export default function Header() {

    const router = useRouter();
    const pathname = usePathname();
    return (
      <header style={{
       
    
    }}>
        <div onClick={()=>{router.push('/');}} style={{display: 'flex',
  alignItems: 'center',
  gap:'0.3em',justifyContent:'center'}}>
        <button id='headerTitle' >Calorie AI </button>
        <Image
        style={{cursor:'pointer'}}
          className="logo"
          width={30}
          height={30}
          alt="food"
          src={"/favicon.ico"}
        />
        </div>
        <div style={{gap:'1em',display:'flex'}}>
        <button onClick={()=>{if(pathname != '/'){router.push('/'); return;} document.getElementById("landing0").scrollIntoView({block: "center"}); }}className='headerBtn'>Why us</button> 
        <button onClick={()=>{if(pathname != '/'){router.push('/'); return;} document.getElementById("landing1").scrollIntoView({block: "center"}); }}className='headerBtn'>Clarity</button>
        <button onClick={()=>{if(pathname != '/'){router.push('/'); return;} document.getElementById("landing3").scrollIntoView({block: "center"}); }}className='headerBtn' >Insights</button>
        <button onClick={()=>{router.push('/track')}}className='headerBtn' >Track</button>
        </div>
        <button onClick={()=>{router.push('/track')}}className='loginBtn'>Get Started</button>
      </header>
    );
  }
  