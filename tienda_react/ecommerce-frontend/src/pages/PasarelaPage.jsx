import { useLocation } from 'react-router-dom'
import '../styles/pasarela.css'
import TopBar from '../components/layout/TopBar'
import PasarelaSummary from '../components/pasarela/PasarelaSummary'
import PasarelaForm from '../components/pasarela/PasarelaForm'

const ENVIO = 10000

const ITEMS_EJEMPLO = [
  {
    idVariante: 'ejemplo-oversize',
    nombre: 'KULT OVERSIZE TEE',
    color: 'Negro',
    talla: 'M',
    precio: 89900,
  },
  {
    idVariante: 'ejemplo-basic',
    nombre: 'KULT BASIC TEE',
    color: 'Blanco',
    talla: 'L',
    precio: 69900,
  },
]

export default function PasarelaPage() {
  const location = useLocation()
  const items = location.state?.items?.length ? location.state.items : ITEMS_EJEMPLO
  const subtotal = items.reduce((suma, item) => suma + Number(item.precio || 0), 0)
  const total = subtotal + ENVIO

  return (
    <div className="pasarela-page">
      <TopBar backTo="/coleccion" />

      <main className="layout">
        <PasarelaSummary items={items} subtotal={subtotal} envio={ENVIO} total={total} />
        <PasarelaForm total={total} />
      </main>

      <footer className="footer">
        <span>© 2026 KULT STUDIO // LAB</span>
        <span>SISTEMA DE COMPRA <b>● ACTIVO</b></span>
      </footer>
    </div>
  )
}
