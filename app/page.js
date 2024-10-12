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
          <button className="generalButton">Get Started</button>
        </div>
        
      </section>
    </main>
  );
}
