'use client'
import { useRouter } from 'next/navigation';


export default function Footer() {

    const router = useRouter();
    //https://teentechsf.org/
    return (
      <footer>
        <span>This website uses predictive algorithms - it is not 100% accurate.</span>
        <button onClick={()=>{window.location.href='https://teentechsf.org/'}} className='footerBtn'>Made with ❤️ for TechTeenSF</button>
        <button onClick={()=>{window.location.href='https://github.com/simonxuuu/calorie-ai'}}className='footerBtn'>Github Repo</button>
      </footer>
    );
  }