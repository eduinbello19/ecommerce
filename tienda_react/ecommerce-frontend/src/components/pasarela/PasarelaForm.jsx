import { useState } from 'react'
import { formatearPrecio } from '../../utils/catalogo'
import { obtenerIdUsuario } from '../../utils/sesion'

const ERROR_CHECKOUT = 'No fue posible completar el pago. Intente más tarde.'

export default function PasarelaForm({ total, items, onCheckout }) {
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [medio, setMedio] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')
  const [status, setStatus] = useState('idle')
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  const mostrarError = (texto) => {
    setMensaje({ tipo: 'error', texto })
    setStatus('error')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (status === 'loading' || status === 'ok') return

    setMensaje({ tipo: '', texto: '' })

    const idUsuario = obtenerIdUsuario()
    if (!idUsuario) {
      mostrarError('Inicie sesión para continuar con el pago.')
      return
    }

    if (!Array.isArray(items) || items.length === 0 || !items.every((item) => Number.isInteger(item?.idVariante))) {
      mostrarError('Los productos del carrito no son válidos para el pago.')
      return
    }

    if (!nombre.trim() || !direccion.trim() || !ciudad.trim() || !telefono.trim() || !medio) {
      mostrarError('Complete los datos de entrega y el método de pago.')
      return
    }

    const payload = {
      idUsuario,
      items: items.map((item) => ({ idVariante: item.idVariante, cantidad: 1 })),
      direccion,
      ciudad,
      telefono,
      medio,
    }

    setStatus('loading')
    try {
      const respuesta = await onCheckout(payload)
      const idPedido = respuesta?.idPedido
      setMensaje({
        tipo: 'ok',
        texto: idPedido ? `Pedido registrado con el id ${idPedido}.` : 'Pedido registrado correctamente.',
      })
      setStatus('ok')
    } catch (error) {
      mostrarError(error.message || ERROR_CHECKOUT)
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>
          <i></i>
          PROTOCOLO DE PAGO
        </h2>
        <span>PASO 02 / 02</span>
      </div>

      <form id="pagoForm" noValidate onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-title">
            <span>01</span>
            INFORMACIÓN DE ENTREGA
          </div>

          <div className="field">
            <label htmlFor="nombre">NOMBRE COMPLETO <em>*</em></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del destinatario"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="direccion">DIRECCIÓN DE ENTREGA <em>*</em></label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Calle, carrera, número..."
              value={direccion}
              onChange={(event) => setDireccion(event.target.value)}
              required
            />
          </div>

          <div className="row two">
            <div className="field">
              <label htmlFor="ciudad">CIUDAD <em>*</em></label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                placeholder="Ciudad"
                value={ciudad}
                onChange={(event) => setCiudad(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="telefono">TELÉFONO <em>*</em></label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Número de contacto"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-title">
            <span>02</span>
            MÉTODO DE PAGO
          </div>

          <div className="field">
            <label htmlFor="medio">SELECCIONA UN MÉTODO <em>*</em></label>
            <select
              id="medio"
              name="medio"
              value={medio}
              onChange={(event) => setMedio(event.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="TC">Tarjeta de crédito</option>
              <option value="TB">Tarjeta débito</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-title">
            <span>03</span>
            DATOS DE PAGO
          </div>

          <div className="field">
            <label htmlFor="tarjeta">NÚMERO DE TARJETA</label>
            <input
              type="text"
              id="tarjeta"
              name="tarjeta"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              inputMode="numeric"
              autoComplete="off"
              value={tarjeta}
              onChange={(event) => setTarjeta(event.target.value)}
            />
          </div>

          <div className="row two">
            <div className="field">
              <label htmlFor="vencimiento">FECHA DE VENCIMIENTO</label>
              <input
                type="text"
                id="vencimiento"
                name="vencimiento"
                placeholder="MM/AA"
                maxLength={5}
                autoComplete="off"
                value={vencimiento}
                onChange={(event) => setVencimiento(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="cvv">CÓDIGO DE SEGURIDAD</label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                placeholder="CVV"
                maxLength={4}
                autoComplete="off"
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
              />
            </div>
          </div>

          <p className="test-note">
            DATOS FICTICIOS PARA SIMULACIÓN ACADÉMICA. NO INGRESES INFORMACIÓN DE TARJETAS REALES.
          </p>
        </div>

        <div className="payment-total">
          <span>TOTAL DE LA TRANSACCIÓN</span>
          <strong>{formatearPrecio(total)} COP</strong>
        </div>

        <button type="submit" className="submit" disabled={status === 'loading' || status === 'ok'}>
          PAGAR AHORA <span>→</span>
        </button>

        {mensaje.texto && (
          <p className={`checkout-message ${mensaje.tipo}`}>{mensaje.texto}</p>
        )}

        <p className="terms">
          AL CONTINUAR, CONFIRMAS QUE LOS DATOS DE TU PEDIDO SON CORRECTOS.
        </p>
      </form>
    </section>
  )
}
