import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import ProductDetail from './components/ProductDetail.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/product/:id' element={<ProductDetail />}/>
      </Routes>
    </StrictMode>,
  </BrowserRouter>
)
