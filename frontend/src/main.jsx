import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Crucial for Router context
import App from './App.jsx'; // Your main App component
import './index.css'; // Your global CSS (if any)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap your App component with BrowserRouter here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);