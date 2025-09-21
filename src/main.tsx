import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // Initialize i18n before App
import App from './App.tsx'
import { initializeExtensionProtection } from './utils/extensionProtection'

// تفعيل حماية الإضافات
initializeExtensionProtection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
