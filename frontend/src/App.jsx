import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import CartPage from './CartPage.jsx';
import AddProduct from './addProduct.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

// Helper function to get the initial theme
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem('shoppingCart');
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      return [];
    }
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- 1. State for managing the current theme ---
  const [theme, setTheme] = useState(getInitialTheme);

  const navigate = useNavigate();
  
  // --- 2. Effect to apply theme changes to the app and save preference ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error('Error fetching products.');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const filteredProducts = products.filter(product =>
    (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollLeft = () => {
    const slider = document.getElementById('slider');
    if (slider) slider.scrollLeft -= 320;
  };

  const scrollRight = () => {
    const slider = document.getElementById('slider');
    if (slider) slider.scrollLeft += 320;
  };

  const handleBuyNow = (product) => {
    if (product.quantity <= 0) {
      toast.error(`${product.description} is out of stock.`);
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (productToAdd) => {
    const existingItem = cartItems.find(item => item.id === productToAdd.id);
    const quantityInCart = existingItem ? existingItem.quantityInCart : 0;
    
    if (quantityInCart >= productToAdd.quantity) {
      toast.warn(`No more stock for "${productToAdd.description}".`);
      return;
    }

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === productToAdd.id
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...productToAdd, quantityInCart: 1 }]);
    }
    toast.success(`Added ${productToAdd.description} to cart!`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantityInCart: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // --- 3. Function to toggle the theme ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const ProductListView = () => (
    <>
      <h1>Products List</h1>
      <div className="search-bar-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (searchTerm) {
                toast.info(`Searching for "${searchTerm}"...`);
              }
            }
          }}
          autoFocus
          aria-label="Search products"
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
            &times;
          </button>
        )}
      </div>
      <div className="slider-container">
        <button className="arrow left" onClick={scrollLeft}>‹</button>
        <div className="products-container" id="slider">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={`${backendUrl}${product.imgUrl}`}
                alt={product.description}
                className="product-image"
              />
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Model:</strong> {product.model}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <div className="card-buttons">
                <button
                  className="card-btn buy-btn"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
                <button
                  className="card-btn add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={scrollRight}>›</button>
      </div>
    </>
  );

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} theme={theme} />
      <header className="header">
        <Link to="/" className="home-link">MyApp</Link>
        <div className="header-actions">
           {/* --- 4. The UI button to toggle the theme --- */}
          <button onClick={toggleTheme} className="btn theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn" onClick={() => navigate('/add-product')}>Add Product</button>
          <button className="btn cart-btn" onClick={() => navigate('/cart')}>
            🛒 Cart ({cartItems.reduce((total, item) => total + item.quantityInCart, 0)})
          </button>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ProductListView />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                allProducts={products}
                setCartItems={setCartItems}
                onCheckoutComplete={fetchProducts}
              />
            }
          />
          <Route path="/add-product" element={<AddProduct onProductAdded={fetchProducts} />} />
          <Route
            path="/product/:id"
            element={<ProductDetailPage onProductQuantityChange={fetchProducts} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;