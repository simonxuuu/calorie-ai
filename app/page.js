import "./globals.css";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <section style={{ marginTop: "10em" }}>
        {" "}
        <div style={{ marginRight: "0.1em" }}>
          <h1 className="heading">Track your calories, with one click.</h1>
          <h2 className="subHeading">
            Subheading Subheading Subheading Subheading Subheading Subheading
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
      
    </main>
  );
}
