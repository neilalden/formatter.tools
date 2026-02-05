import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../tailwind.css'
import './main.css'
import { MainScreen } from './MainScreen'
import { ToastProvider } from './hooks/useToast'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
    <MainScreen />
    </ToastProvider>
  </StrictMode>,
)
