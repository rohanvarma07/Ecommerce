import React from 'react';
import './CartPage.css';

function CartPage({ cartItems, onUpdateQuantity, onRemoveItem }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantityInCart), 0);

  return (
    <div className="cart-page-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty. Start shopping!</p>
      ) : (
        <div className="cart-items-wrapper">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              {/* --- MODIFIED: Use item.imgUrl --- */}
              {item.imgUrl && (
                <img
                  src={`http://localhost:8080${item.imgUrl}`}
                  alt={item.description || 'Product image'}
                  className="cart-item-image"
                />
              )}
              {/* --- END MODIFIED --- */}
              <div className="cart-item-details">
                <h3>{item.description}</h3>
                {/* --- NEW: Optionally display model in cart --- */}
                {item.model && <p>Model: {item.model}</p>}
                {/* --- END NEW --- */}
                <p>Price: ₹{item.price}</p>
                <div className="cart-item-quantity-controls">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantityInCart - 1)}
                    disabled={item.quantityInCart <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantityInCart}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantityInCart + 1)}
                  >
                    +
                  </button>
                </div>
                <p>Subtotal: ₹{(item.price * item.quantityInCart).toFixed(2)}</p>
                <button
                  className="remove-item-btn"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
            <button className="btn checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;