'use client'

export default function Footer() {
    return (
      <footer>
        <span>This website uses predictive algorithms - it is not 100% accurate.</span>
        <button onClick={()=>{window.location.href='https://teentechsf.org/'}} className='footerBtn'>Made with ❤️ for TechTeenSF</button>
        <button onClick={()=>{window.location.href='https://github.com/simonxuuu/calorie-ai'}}className='footerBtn'>Github Repo</button>
      </footer>
    );
  }