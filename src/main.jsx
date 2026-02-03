import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initAnalytics } from '@/utils/analytics'

// Initialize analytics on app start
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 