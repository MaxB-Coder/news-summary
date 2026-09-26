import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BASE_URL is / normally, and /demos/news-summary/ in the portfolio demo */}
    <Router basename={import.meta.env.BASE_URL}>
      <App />
    </Router>
  </React.StrictMode>,
)
