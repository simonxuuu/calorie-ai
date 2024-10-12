import "./globals.css";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <section id='landing0'style={{ marginTop: "10em" }}>
        {" "}
        <div className="sectionContentRight">
          <h1 className="heading">Track your calories, with one click.</h1>
          <h2 className="subHeading">
            Your journey to a healthier lifestyle starts here.
          </h2>
          <button className="generalButton">Get Started</button>
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
          <h1 className="heading">Track your calories, with one click.</h1>
          <h2 className="subHeading">
            Effortless tracking for a better you.
          </h2>
         
        </div>
        
      </section>
      <section id='landing1'style={{ marginTop: "10em",justifyContent:'center' }}>
      
        <div style={{margin:0,marginLeft:0}}className="sectionContentLeft">
          <h1 style={{textAlign:'center'}}className="heading">Track your calories, with one click.</h1>
          <h2 style={{textAlign:'center'}} className="subHeading">
            Effortless tracking for a better you.
          </h2>
         
        </div>
        
      </section>
      <section id='landing0'style={{ marginTop: "10em" }}>
        {" "}
        <div className="sectionContentRight">
          <h1 className="heading">Track your calories, with one click.</h1>
          <h2 className="subHeading">
            Your journey to a healthier lifestyle starts here.
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
      <section id='landing1'style={{ marginTop: "10em",justifyContent:'center' }}>
      
        <div style={{margin:0,paddingLeft:0,display:'flex',flexDirection:'column',alignItems:'center'}}className="sectionContentLeft">
          <h1 style={{textAlign:'center'}}className="heading">One click is all it takes to better your health.</h1>
          <button className="generalButton">Get Started</button>
         
        </div>
        
      </section>
    </main>
  );
}
