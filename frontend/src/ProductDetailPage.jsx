import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProductDetailPage.css'; // Import the new CSS file

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

function ProductDetailPage({ onProductQuantityChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        toast.error("Could not find the product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handlePurchase = async () => {
    if (quantityToBuy > product.quantity) {
      toast.error(`Not enough stock. Only ${product.quantity} available.`);
      return;
    }

    try {
      const updatedQuantity = product.quantity - quantityToBuy;
      const formData = new FormData();
      formData.append('description', product.description);
      formData.append('model', product.model.toString());
      formData.append('quantity', updatedQuantity);
      formData.append('price', product.price);

      await axios.put(`${backendUrl}/api/products/${id}`, formData);
      toast.success(`Purchase of ${product.description} confirmed!`);
      
      if (onProductQuantityChange) {
        onProductQuantityChange();
      }
      navigate('/');
    } catch (err) {
      toast.error("Purchase failed. Please try again.");
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!product) return <p className="error-message">Product not found.</p>;

  return (
    <div className="detail-container">
      <div className="detail-image-wrapper">
        <img src={`${backendUrl}${product.imgUrl}`} alt={product.description} />
      </div>

      <div className="detail-info-wrapper">
        <h2 className="detail-title">{product.description}</h2>
        <p className="detail-model">Model: {product.model}</p>
        <p className="detail-stock">Available: {product.quantity} units</p>
        <p className="detail-price">₹{product.price.toFixed(2)}</p>

        <div className="detail-actions">
          <input
            type="number"
            className="quantity-input"
            value={quantityToBuy}
            onChange={(e) => setQuantityToBuy(Number(e.target.value))}
            min="1"
            max={product.quantity}
            aria-label="Quantity to buy"
          />
          <button 
            className="buy-button" 
            onClick={handlePurchase} 
            disabled={product.quantity === 0 || quantityToBuy > product.quantity}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;