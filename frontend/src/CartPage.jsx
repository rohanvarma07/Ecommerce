import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CartPage.css';

// The component now accepts `allProducts` to check against available stock.
function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, allProducts = [], setCartItems, onCheckoutComplete }) {

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantityInCart), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warn("Your cart is empty. Add items before checking out!");
      return;
    }

    // Simulate a successful checkout process
    // In a real application, you would integrate with a payment gateway
    // and update backend stock here.
    console.log("Processing checkout for items:", cartItems);

    // Clear the cart after successful checkout
    setCartItems([]); // Assuming setCartItems is passed as a prop to clear the cart

    // Notify the user of successful checkout
    toast.success("Checkout successful! Your order has been placed.");

    // Call the onCheckoutComplete callback if provided
    if (onCheckoutComplete) {
      onCheckoutComplete();
    }
  };

  return (
    <div className="cart-page-container">
      {/* Add ToastContainer to display notifications */}
      <ToastContainer position="top-center" autoClose={2500} />
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty. Start shopping!</p>
      ) : (
        <div className="cart-items-wrapper">
          {cartItems.map(item => {
            // Find the full details of the product to get its total stock
            const productInStock = allProducts.find(p => p.id === item.id);
            const totalStock = productInStock ? productInStock.quantity : 0;
            const isOutOfStock = totalStock === 0;

            return (
              <div key={item.id} className={`cart-item-card ${isOutOfStock ? 'disabled-item' : ''}`}>
                {/* Ensure img src is correct, assuming it's served from localhost:8081 */}
                <img
                  src={`http://localhost:8081${item.imgUrl}`}
                  alt={item.description}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.description}</h3>
                  {item.model && <p>Model: {item.model}</p>}
                  <p>Price: ₹{item.price.toFixed(2)}</p>

                  {/* --- NEW: Conditional Rendering based on stock --- */}
                  {!isOutOfStock ? (
                    <div className="cart-item-quantity-controls">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantityInCart - 1)}
                        disabled={item.quantityInCart <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantityInCart}</span>
                      <button
                        onClick={() => {
                          // Only increase if cart quantity is less than total stock
                          if (item.quantityInCart < totalStock) {
                            onUpdateQuantity(item.id, item.quantityInCart + 1);
                          } else {
                            toast.warn(`No more stock for "${item.description}".`);
                          }
                        }}
                        // Disable button if cart quantity matches or exceeds total stock
                        disabled={item.quantityInCart >= totalStock}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <p className="out-of-stock-message">Out of Stock</p>
                  )}
                  {/* --- END NEW --- */}

                  <p>Subtotal: ₹{(item.price * item.quantityInCart).toFixed(2)}</p>
                  <button
                    className="remove-item-btn"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div className="cart-summary">
            <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
            <button className="btn checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
