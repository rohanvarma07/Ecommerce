import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Main application styles
import CartPage from './CartPage.jsx'; // Import CartPage component
import AddProduct from './addProduct.jsx'; // Import AddProduct component

function App() {
  // Initialize cartItems state, attempting to load from Local Storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem('shoppingCart');
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Failed to parse cart items from local storage:", error);
      return []; // Return empty array if parsing fails
    }
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Effect to fetch product data from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        // Log the raw response data to see its structure
        console.log("Products fetched from backend:", response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Effect to save cartItems to Local Storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart items to local storage:", error);
    }
  }, [cartItems]);

  // Filters products based on the search term
  const filteredProducts = products.filter(product =>
    (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scrolls the product slider left
  const scrollLeft = () => {
    const slider = document.getElementById('slider');
    if (slider) {
      slider.scrollLeft -= 320;
    }
  };

  // Scrolls the product slider right
  const scrollRight = () => {
    const slider = document.getElementById('slider');
    if (slider) {
      slider.scrollLeft += 320;
    }
  };

  const handleBuyNow = (productId) => {
    console.log(`Buy Now clicked for product ID: ${productId}`);
    alert(`Initiating purchase for product ID: ${productId}`);
  };

  // Handles adding a product to the cart or updating its quantity if already present
  const handleAddToCart = (productToAdd) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === productToAdd.id);

    if (existingItemIndex > -1) {
      const updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      );
      setCartItems(updatedCartItems);
      alert(`Increased quantity of ${productToAdd.description} in cart!`);
    } else {
      setCartItems([...cartItems, { ...productToAdd, quantityInCart: 1 }]);
      alert(`Added ${productToAdd.description} to cart!`);
    }
    console.log("Current Cart:", cartItems);
  };

  // Handles updating the quantity of an item directly in the cart page
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

  // Handles removing an item completely from the cart (no alert)
  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Navigates to the /cart route when the "Cart" button is clicked
  const handleViewCart = () => {
    navigate('/cart');
  };

  // Navigates to the Add Product page
  const handleAddProductClick = () => {
    navigate('/add-product');
  };

  // Clears the search bar input
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // ProductListView Component: Displays the main product list and search bar
  const ProductListView = () => (
    <>
      <h1>Products List</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by description..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Products"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              console.log("Search Term Submitted:", searchTerm);
            }
          }}
        />
        <span className="search-icon">🔍</span>
        {searchTerm && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            &times;
          </button>
        )}
      </div>

      <div className="slider-container">
        <button className="arrow left" onClick={scrollLeft}>‹</button>

        <div className="products-container" id="slider">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {/* Correctly use product.imgUrl from backend */}
              {product.imgUrl && (
                <img
                  src={`http://localhost:8080${product.imgUrl}`} // Ensure this URL matches your backend's served path
                  alt={product.description || 'Product image'} // Fallback alt text for accessibility
                  className="product-image" // Apply CSS for sizing/styling
                />
              )}

              <p><strong>Description:</strong> {product.description}</p>
              {/* Display Product Model, ensure 'model' is correct from backend */}
              {product.model !== undefined && <p><strong>Model:</strong> {product.model}</p>}
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>

              <div className="card-buttons">
                <button
                  className="card-btn buy-btn"
                  onClick={() => handleBuyNow(product.id)}
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
    // Assuming <BrowserRouter> is in your main.jsx
    <div id="root">
      {/* Header section, visible on all pages */}
      <div className="header">
        <Link to="/" className="btn">Home</Link>
        <button className="btn" onClick={handleAddProductClick}>Add Product</button>
        <button className="btn cart-btn" onClick={handleViewCart}>
          Cart ({cartItems.reduce((total, item) => total + item.quantityInCart, 0)})
        </button>
      </div>

      {/* Routes definition: only one route's element will be rendered at a time */}
      <Routes>
        <Route path="/" element={<ProductListView />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          }
        />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

export default App;