import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ColeccionPage from './pages/ColeccionPage'
import PasarelaPage from './pages/PasarelaPage'
import NewProductPage from './pages/NewProductPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/registro" replace />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/coleccion" element={<ColeccionPage />} />
      <Route path="/pasarela" element={<PasarelaPage />} />
      <Route path="/new_product" element={<NewProductPage />} />
      <Route path="*" element={<Navigate to="/registro" replace />} />
    </Routes>
  )
}

export default App
