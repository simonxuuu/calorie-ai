"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useAppContext } from "@/app/appContext";

export default function Track() {
  const { jwt } = useAppContext()!;
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imagePrev, setImagePrev] = useState<string | undefined>(undefined);
  const [dataReceived, setDataReceived] = useState(false);
  const [additionalInput, setAdditionalInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nutritionalValues, setNutritionalValues] = useState({
    foodName: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    health_score: 0,
    feedback: "",
  });
  const dateRef = useRef<HTMLInputElement>(null);
  const [retreivedImage, setRetreivedImage] = useState("data:,");
  const handleFileChange = async (e) => {
    const originalFile = e.target.files[0];
    if (!originalFile) return;

    const options = {
      maxSizeMB: 4, // Set maximum size to 4MB
      maxWidthOrHeight: 1920, // Adjust as needed
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(originalFile, options);
      console.log("Compressed file:", compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePrev(String(reader.result));
      };
      reader.readAsDataURL(compressedFile);
      setFile(compressedFile);
    } catch (error) {
      console.error("Image compression failed:", error);
      setError("Image compression failed: " + error.message);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log(e.dataTransfer);
    handleFileChange(e);
  };
  const retreiveSnaps = async () => {
    if (!dateRef.current) return;
    if (!dateRef.current.value) return;
    if (!jwt) return;

    const dateValue = dateRef.current.value; //YYYY-MM-DD STR Format
    let startDate = new Date(
      parseInt(dateValue.split("-")[0]),
      parseInt(dateValue.split("-")[1]) - 1,
      parseInt(dateValue.split("-")[2]),
      0,
      0,
      0,
      0
    );
    let endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    await fetch(
      `/api/retrieveSnap/?gle=${encodeURIComponent(
        startDate.toISOString()
      )}&lt=${encodeURIComponent(
        endDate.toISOString()
      )}&jwt=${encodeURIComponent(jwt)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (res[0].image)
          setRetreivedImage("data:image/jpeg;base64," + res[0].image);
        for (let snap of res) {
          console.log(snap);
          let utcTime = new Date(snap.createdAt);
          console.log(
            utcTime.toLocaleDateString(),
            utcTime.toLocaleTimeString()
          );
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("Loading..."); // Set error to "Loading..." when form is submitted

    try {
      const response = await fetch("/api/uploadSnap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawData: imagePrev, additionalInput, jwt: jwt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json();
      data = data.message;
      console.log("Success:", data);

      setNutritionalValues({
        foodName: data.foodName,
        calories: Number(data.calories),
        carbs: Number(data.carbs),
        fat: Number(data.fat),
        protein: Number(data.protein),
        feedback: data.feedback,
        health_score: data.health_score,
      });
      setDataReceived(true);
      setError(""); // Clear error on success
    } catch (error) {
      setError("Error: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <main>
      <section style={{ marginTop: "10em" }}>
        <div className="trackingPage">
          <div className="trackingSide">
            <input type="date" ref={dateRef} />
            <button onClick={retreiveSnaps}>test retreive snaps</button>
            <Image
              width={250}
              height={250}
              alt={"file"}
              src={retreivedImage ?? "data:,"}
            />
            <h1 className="header">Track your Calories</h1>
            <span className="error">{error}</span>
            <form className="trackingSideFORM" onSubmit={handleSubmit}>
              <label
                htmlFor="file"
                style={{ marginBottom: "1rem", marginTop: "1em" }}
              >
                Upload a clear image of your food and add additional information
                if needed
              </label>
              <input
                type="text"
                id="additionalInput"
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
                placeholder="Enter additional information"
                name="additionalInput"
              />
              <div
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                className="file-upload"
                onClick={() => fileInputRef?.current?.click()}
                style={{ cursor: "pointer" }}
              >
                <p>Click to upload or drag and drop</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <button className="generalButton" type="submit">
                Submit
              </button>
            </form>

            <Image
              style={{
                borderRadius: "1rem",
                display: `${file ? "block" : "none"}`,
                maxWidth: "100%",
                width: "75%",
                height: "auto",
                objectFit: "contain",
              }}
              className="submittedImage"
              width={250}
              height={250}
              alt={"file"}
              src={imagePrev ?? "data:,"}
            />
          </div>

          {dataReceived && (
            <div className="nutritionalSide">
              <h2 className="header">{nutritionalValues.foodName}</h2>
              <button className="generalButton" style={{ marginTop: "1em" }}>
                Log food
              </button>
              <span className="nutritionalValues">
                Calories: {nutritionalValues.calories}
              </span>
              <div className="emptyProgressBar">
                <div
                  className="filledProgressBar"
                  style={{
                    width: `${(nutritionalValues.calories / 2000) * 100}%`,
                    backgroundColor: "#76c7c0",
                  }}
                ></div>
              </div>
              <span className="nutritionalValues">
                Carbs: {nutritionalValues.carbs}g
              </span>
              <div className="emptyProgressBar">
                <div
                  className="filledProgressBar"
                  style={{
                    width: `${(nutritionalValues.carbs / 300) * 100}%`,
                    backgroundColor: "#f39c12",
                  }}
                ></div>
              </div>
              <span className="nutritionalValues">
                Fat: {nutritionalValues.fat}g
              </span>
              <div className="emptyProgressBar">
                <div
                  className="filledProgressBar"
                  style={{
                    width: `${(nutritionalValues.fat / 70) * 100}%`,
                    backgroundColor: "#e74c3c",
                  }}
                ></div>
              </div>
              <span className="nutritionalValues">
                Protein: {nutritionalValues.protein}g
              </span>
              <div className="emptyProgressBar">
                <div
                  className="filledProgressBar"
                  style={{
                    width: `${(nutritionalValues.protein / 50) * 100}%`,
                    backgroundColor: "#3498db",
                  }}
                ></div>
              </div>
              <span className="nutritionalValues">
                Health Score: {nutritionalValues.health_score} / 10
              </span>
              <div className="emptyProgressBar">
                <div
                  className="filledProgressBar"
                  style={{
                    width: `${(nutritionalValues.health_score / 10) * 100}%`,
                    backgroundColor: "green",
                  }}
                ></div>
              </div>
              <p className="feedback">{nutritionalValues.feedback}</p>
            </div>
          )}
        </div>
        <br></br>
      </section>
    </main>
  );
}
