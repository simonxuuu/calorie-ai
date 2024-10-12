"use client"
// components/ImageUploader.js
import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files[0])}
        />
        <button type="submit">Analyze Image</button>
      </form>
      {description && <p>{description}</p>}
    </div>
  );
};

export default ImageUploader;