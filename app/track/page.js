"use client"
import { useState } from 'react';
import Image from "next/image";

export default function Track() {
    const [file, setFile] = useState(null);
    const [imagePrev, setImagePrev] = useState('/images/food1.jpg');
    const [dataReceived, setDataReceived] = useState(false);
    const [nutritionalValues, setNutritionalValues] = useState({
        foodName: "",
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        feedback: ""
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePrev(reader.result);
        };
        reader.readAsDataURL(file);
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/getNutritionalData', {
                method: 'POST',
                body: imagePrev
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const data = await response.json();
            console.log('Success:', data);

            // Extract JSON string correctly
            const jsonString = data.result.replace(/```json|```/g, '').replace(/'/g, '"');
            const parsedData = JSON.parse(jsonString);
        

            setNutritionalValues({
                foodName: parsedData.foodName,
                calories: Number(parsedData.calories),
                carbs: Number(parsedData.carbs),
                fat: Number(parsedData.fat),
                protein: Number(parsedData.protein),
                feedback: parsedData.feedback
            });
            setDataReceived(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <main>
            <section style={{ marginTop: "10em" }}>
                <div className="trackingPage">
                    <div className="trackingSide">
                    <h1 className='header'>Track your Calories</h1>
                    <form className="trackingSide" onSubmit={handleSubmit}>
                        <input type="file" onChange={handleFileChange} />
                        <button className='generalButton' type="submit">Submit</button>
                    </form>
                    <Image 
                        style={{ 
                            borderRadius: '1rem',
                            display: `${file ? 'block' : 'none'}`, 
                            maxWidth: '100%', 
                            width: '75%',
                            height: 'auto', 
                            objectFit: 'contain' 
                        }}
                        className="submittedImage"
                        width={250}
                        height={250}
                        alt={'file'}
                        src={imagePrev}
                    />
                    </div>
                    
                    {dataReceived && (
                        <div className="nutritionalSide">
                            <h2 className="header">{nutritionalValues.foodName}</h2>
                            <span className="nutritionalValues">Calories: {nutritionalValues.calories}</span>
                            <div className="emptyProgressBar">
                                <div className="filledProgressBar" style={{ width: `${nutritionalValues.calories / 2000 * 100}%`, backgroundColor: '#76c7c0' }}></div>
                            </div>
                            <span className="nutritionalValues">Carbs: {nutritionalValues.carbs}g</span>
                            <div className="emptyProgressBar">
                                <div className="filledProgressBar" style={{ width: `${nutritionalValues.carbs / 300 * 100}%`, backgroundColor: '#f39c12' }}></div>
                            </div>
                            <span className="nutritionalValues">Fat: {nutritionalValues.fat}g</span>
                            <div className="emptyProgressBar">
                                <div className="filledProgressBar" style={{ width: `${nutritionalValues.fat / 70 * 100}%`, backgroundColor: '#e74c3c' }}></div>
                            </div>
                            <span className="nutritionalValues">Protein: {nutritionalValues.protein}g</span>
                            <div className="emptyProgressBar">
                                <div className="filledProgressBar" style={{ width: `${nutritionalValues.protein / 50 * 100}%`, backgroundColor: '#3498db' }}></div>
                            </div>
                            <p className="feedback">{nutritionalValues.feedback}</p>
                        </div>
                    )}
                </div>
                <br></br>
            </section>
        </main>
    )};