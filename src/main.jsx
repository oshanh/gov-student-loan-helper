import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AllCoursesPage from './components/AllCoursesPage.jsx'
import EligibilityPage from './components/EligibilityPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/all-courses'
      ? <AllCoursesPage />
      : window.location.pathname.replace(/\/+$/, '') === '/eligibility'
        ? <EligibilityPage />
        : <App />}
  </StrictMode>,
)
