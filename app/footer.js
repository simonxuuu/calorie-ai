'use client'
import { useRouter } from 'next/navigation';


export default function Footer() {

    const router = useRouter();

    return (
      <footer>
        <button className='footerBtn'>Made with ❤️ for TechTeenSF</button>
        <button onClick={()=>{window.location.href='https://github.com/simonxuuu/calorie-ai'}}className='footerBtn'>Github Repo</button>
      </footer>
    );
  }