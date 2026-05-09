import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/* Importação dos estilos globais e variáveis */
import './styles/variables.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);