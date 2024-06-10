// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import authStore from './stores/authStore';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider authStore={authStore}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
