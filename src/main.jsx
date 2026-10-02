import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
console.log('App loaded - cache busted!')
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)




