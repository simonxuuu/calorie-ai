'use client'
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Image from "next/image";
export default function Home() {

const router = useRouter();

  return (
    <main>
      <section id='landing0' style={{ marginTop: "10em" }}>
        {" "}
        <div className="sectionContentRight">
          <h1 className="heading">Track your calories, with one click.</h1>
          <h2 className="subHeading">
            Your journey to a healthier lifestyle starts here. We know how hard it can be to keep track of what you eat, so we made it easy for you.
          </h2>
          <button onClick={()=>{router.push('/track')}}className="generalButton">Get Started</button>
        </div>
        <Image
          className="showcaseImage"
          width={500}
          height={500}
          alt="food"
          src={"/images/food1.jpg"}
        />
      </section>
      <section id='landing1'style={{ marginTop: "10em" }}>
      <Image
          className="showcaseImage"
          width={500}
          height={500}
          alt="food"
          src={"/images/fitnessman.jpeg"}
        />
        <div className="sectionContentLeft">
          <h1 className="heading">Drastically improve your health & wellbeing</h1>
          <h2 className="subHeading">
           By being able to see what is in your food, you will be able to get a clear picture about what you are eating, and how it's affecting your day-to-day life. Your diet impacts every aspect of your life, from your sleep, your wellbeing, and your energy levels.
          </h2>
         
        </div>
        
      </section>
      <section id='landing2'style={{ marginTop: "10em",justifyContent:'center' ,padding:0}}>
      
        <div style={{margin:0,marginLeft:0}}className="sectionContentLeft">
          <h1 style={{textAlign:'center'}}className="heading">Click. Wait. See. </h1>
          <h2 style={{textAlign:'center'}} className="subHeading">
            Effortless tracking for a better you. 
          </h2>
         
        </div>
        
      </section>
      <section id='landing3'style={{ marginTop: "10em" }}>
        {" "}
        <div className="sectionContentRight">
          <h1 className="heading">Understand what is in your food</h1>
          <h2 className="subHeading">
            Your journey to a healthier lifestyle starts here. Know what you're eating and how it's affecting your health. Tracking your nutrition is crucial to improving your health.
          </h2>
          
        </div>
        <Image
          className="showcaseImage"
          width={500}
          height={500}
          alt="food"
          src={"/images/food2.jpg"}
        />
      </section>
      <section id='landing4'style={{ marginTop: "10em",justifyContent:'center',padding:0}}>
      
        <div style={{margin:0,paddingLeft:0,display:'flex',flexDirection:'column',alignItems:'center'}}className="sectionContentLeft">
          <h1 style={{textAlign:'center'}}className="heading">One click is all it takes to better your health.</h1>
          <button onClick={()=>{router.push('/track')}} className="generalButton">Let's go</button>
         
        </div>
        
      </section>
    </main>
  );
}
