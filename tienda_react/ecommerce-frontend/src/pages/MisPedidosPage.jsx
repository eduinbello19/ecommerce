import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/coleccion.css'
import '../styles/mispedidos.css'
import ColeccionHeader from '../components/coleccion/ColeccionHeader'
import PedidoCard from '../components/pedidos/PedidoCard'
import { obtenerHistorialPedidos } from '../services/catalogoService'
import { obtenerIdUsuario, obtenerSesion } from '../utils/sesion'

const HEADER_VACIO = {
  search: '',
  onSearchChange: () => {},
  cart: [],
  cartOpen: false,
  onCartToggle: () => {},
  onRemove: () => {},
}

export default function MisPedidosPage() {
  const idUsuario = obtenerIdUsuario()
  const sesion = obtenerSesion()
  const [pedidos, setPedidos] = useState([])
  const [estadoCarga, setEstadoCarga] = useState(idUsuario ? 'cargando' : 'sin-sesion')
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!idUsuario) return undefined

    let activo = true

    obtenerHistorialPedidos(idUsuario)
      .then((datos) => {
        if (!activo) return
        setPedidos(datos)
        setEstadoCarga('listo')
      })
      .catch((fallo) => {
        if (!activo) return
        setError(fallo.message || 'No fue posible cargar el historial de pedidos.')
        setEstadoCarga('error')
      })

    return () => {
      activo = false
    }
  }, [idUsuario, intento])

  const reintentar = () => {
    setError('')
    setEstadoCarga('cargando')
    setIntento((valor) => valor + 1)
  }

  return (
    <div className="coleccion-page mis-pedidos-page">
      <ColeccionHeader {...HEADER_VACIO} />

      <main className="layout historial">
        <section className="intro">
          <span className="tag"><i></i> HISTORIAL // CLIENTE</span>
          <h1>MIS<br />PEDIDOS</h1>
          <p className="subtitle">// REGISTRO DE COMPRAS Y ESTADO DE ENVÍO</p>
          <p className="lead">
            {sesion?.nombre ? `Hola, ${sesion.nombre}. ` : ''}Consulta aquí las prendas, el estado y el pago de cada una de tus órdenes.
          </p>
        </section>

        <section className="historial-resultado">
          {estadoCarga === 'sin-sesion' && (
            <div className="historial-aviso">
              <h2>INICIA SESIÓN PARA VER TUS PEDIDOS</h2>
              <p>Necesitas acceso de cliente para consultar tu historial de compras.</p>
              <Link className="btn lime" to="/login">[IR A ACCESO CLIENTES]</Link>
            </div>
          )}

          {estadoCarga === 'cargando' && <p className="historial-aviso mono">CARGANDO HISTORIAL...</p>}

          {estadoCarga === 'error' && (
            <div className="historial-aviso">
              <h2>NO FUE POSIBLE CARGAR EL HISTORIAL</h2>
              <p className="historial-error">{error}</p>
              <button type="button" className="btn lime" onClick={reintentar}>[REINTENTAR]</button>
            </div>
          )}

          {estadoCarga === 'listo' && pedidos.length === 0 && (
            <div className="historial-aviso">
              <h2>AÚN NO TIENES PEDIDOS</h2>
              <p>Cuando realices una compra, aparecerá aquí con su estado y detalles.</p>
              <Link className="btn lime" to="/coleccion">[VER COLECCIÓN]</Link>
            </div>
          )}

          {estadoCarga === 'listo' && pedidos.length > 0 && (
            <>
              <div className="historial-cabecera mono">
                <span>{String(pedidos.length).padStart(2, '0')} ÓRDENES REGISTRADAS</span>
                <span>MÁS RECIENTES PRIMERO</span>
              </div>
              <div className="historial-lista">
                {pedidos.map((pedido) => <PedidoCard key={pedido.idPedido} pedido={pedido} />)}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
