import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './base.css'; // global tokens first, so component styles can override them
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
