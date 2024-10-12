"use client"
import { useState } from 'react';

export default function Track() {
    const [file, setFile] = useState(null);

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
        console.log(result);
    };

    return (
        <div className="trackingPage">
            <h1>Track your calories with just a picture</h1>
            <form onSubmit={handleSubmit} className="trackingSubmit">
            <input type="file" name="image" onChange={handleFileChange} />
            <button type="submit" className="submitButton">Submit</button>
            </form>
        </div>
    );
}