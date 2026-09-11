// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'   // ✅ ADD KIYA
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ TOASTER MOUNTED - Sabse upar, taaki har page pe dikhe */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #2a2a2a',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '10px',
          maxWidth: '400px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#14321e',
            color: '#4ade80',
            border: '1px solid #4ade80',
          },
          iconTheme: {
            primary: '#4ade80',
            secondary: '#14321e',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#3a1a1a',
            color: '#ff6b6b',
            border: '1px solid #ff6b6b',
          },
          iconTheme: {
            primary: '#ff6b6b',
            secondary: '#3a1a1a',
          },
        },
        loading: {
          style: {
            background: '#1a1a1a',
            color: '#e6a730',
            border: '1px solid #e6a730',
          },
          iconTheme: {
            primary: '#e6a730',
            secondary: '#1a1a1a',
          },
        },
      }}
    />
    <App />
  </React.StrictMode>,
)