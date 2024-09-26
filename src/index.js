import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App'; 
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Ajouter ceci
import reportWebVitals from './reportWebVitals';

// Initialisation de l'application React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enregistrement du service worker
serviceWorkerRegistration.register(); // Activer l'enregistrement du service worker

reportWebVitals();
