import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'react-hot-toast-custom',
              style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#0f172a' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: '#0f172a' },
              },
            }}
          />
        </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
