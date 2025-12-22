// src/main.jsx  ← UPDATE THIS FILE
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import JobContextProvider from './context/JobContext.jsx'
import { Toaster } from 'react-hot-toast'   // ← ADD THIS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <JobContextProvider>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              fontSize: '16px',
              padding: '16px 24px',
              borderRadius: '12px',
              maxWidth: '500px',
            },
            success: {
              style: { background: '#10b981' },
              icon: 'Success'
            },
            error: {
              style: { background: '#ef4444' },
              icon: 'Error'
            },
            loading: {
              style: { background: '#6366f1' },
            },
          }}
        />
      </JobContextProvider>
    </BrowserRouter>
  </StrictMode>
)