import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import '@coreui/icons/css/all.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
