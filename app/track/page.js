"use client"
import { useState, useEffect } from 'react';

export default function Track() {
    const [file, setFile] = useState(null);
    const [nutritionalValues, setNutritionalValues] = useState({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/nutritionalValues', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        setNutritionalValues(result);
        console.log(result);
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
            <div className="trackingSide">
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="nutritionalSide">
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