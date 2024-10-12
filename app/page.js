import "./globals.css";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <section style={{marginTop:'10em'}}> <div>
      <h1 className="heading">Track your calories with just a picture,</h1>
      <h2 className="subHeading">Track your calories with just a picture,</h2>
      </div>
       
       <Image className='showcaseImage'width={500} height={500}alt='food' src={'/images/food1.jpg'}/>
      </section>
      <section>
        <h1 className="heading">Track your calories with just a picture,</h1>
      </section>
      <section>
        <h1>Track your calories with just a picture,</h1>
      </section>
      <section>
        <h1>Track your calories with just a picture,</h1>
      </section>

    </main>
  );
}
