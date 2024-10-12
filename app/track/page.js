"use client"
import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Track() {
    const [file, setFile] = useState(null);
    const [imagePrev,setImagePrev] = useState('/images/food1.jpg');
    const [dataReceived,setDataReceived] = useState(null);
    const [nutritionalValues, setNutritionalValues] = useState({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    });
    
    




    const handleFileChange = (e) => {
        const file = e.target.files[0];
    if (!file) return; // Check if a file is selected

    const reader = new FileReader();
    
    reader.onloadend = () => {
        console.log(reader.result);
        
        setImagePrev(reader.result);
    };
    
    reader.readAsDataURL(file);
    setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        fetch('/api/nutritionalValues', {
            method: 'POST',
            body: imagePrev.split(',')[1],
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
            // Process the data as needed
          })
          .catch(error => {
            console.error('Error:', error);
          });
        
    };

    const renderNutritionalValues = () => {
        return (
            <div>
                <h2>Calories: {nutritionalValues.calories}</h2>
                <h2>Carbs: {nutritionalValues.carbs}</h2>
                <h2>Fat: {nutritionalValues.fat}</h2>
                <h2>Protein: {nutritionalValues.protein}</h2>
            </div>
        );
    }

    useEffect(() => {
        if (nutritionalValues.calories) {
            renderNutritionalValues();
        }
    }, [nutritionalValues]);

    return (
        <main>
      <section style={{ marginTop: "10em" }}>
        <div className="trackingPage">
            <h1 className='header'>Track your Calories</h1>
            
                <form  className="trackingSide" onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button className='generalButton'type="submit">Submit</button>
                </form>
                <Image 
                style={{display:`${(file!=null) ? 'block' : 'none'}`}}
          className="submittedImage"
          width={500}
          height={500}
          alt={'file'}
          src={imagePrev}
        />
            <div style={{display:`${dataReceived ? 'flex' : 'none'}`}}className="nutritionalSide">
                <span className="nutritionalValues">Calories: {nutritionalValues.calories}</span>
                <div className="emptyProgressBar">
                    <div className="filledProgressBar" style={{ width: `${nutritionalValues.calories / 2000 * 100}%` }}></div>
                </div>
            </div>
        </div>
        
      </section>
      
    </main>
    );
}