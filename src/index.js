// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './pages/App';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider } from 'mobx-react';
// import authStore from './stores/authStore';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
