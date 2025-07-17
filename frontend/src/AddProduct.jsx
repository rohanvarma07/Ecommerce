import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

function AddProduct() {
  const [description, setDescription] = useState('');
  const [model, setModel] = useState(''); // --- NEW STATE: For product model ---
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('model', model); // --- NEW: Append model to form data ---
    formData.append('quantity', quantity);
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile); // This 'image' matches Spring Boot's @RequestParam("image")
    }

    try {
      const response = await axios.post('http://localhost:8081/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
      });
      console.log('Product added successfully:', response.data);
      setMessage('Product added successfully!');
      // Clear form fields
      setDescription('');
      setModel(''); // Clear model field
      setQuantity('');
      setPrice('');
      setImageFile(null);
      document.getElementById('imageUpload').value = ''; // Clear file input
      setTimeout(() => {
        navigate('/'); // Go back to home page
      }, 1500);

    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Failed to add product. Please try again.');
      if (error.response && error.response.data) {
        console.error("Backend error details:", error.response.data);
        setMessage(`Failed to add product: ${error.response.data.message || error.response.statusText}`);
      }
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {/* --- NEW: Product Model Input Field --- */}
        <div className="form-group">
          <label htmlFor="model">Model:</label>
          <input
            type="number" // Assuming model is a number
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {/* --- END NEW --- */}

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUpload">Product Image:</label>
          <input
            type="file"
            id="imageUpload"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
            className="form-input-file"
          />
        </div>

        <button type="submit" className="btn submit-btn">Add Product</button>
      </form>
      {message && <p className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
}

export default AddProduct;