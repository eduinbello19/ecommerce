import { formatearPrecio } from '../../utils/catalogo'

export default function PasarelaForm({ total }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>
          <i></i>
          PROTOCOLO DE PAGO
        </h2>
        <span>PASO 02 / 02</span>
      </div>

      <form id="pagoForm">
        <div className="form-section">
          <div className="form-title">
            <span>01</span>
            INFORMACIÓN DE ENTREGA
          </div>

          <div className="field">
            <label htmlFor="nombre">NOMBRE COMPLETO <em>*</em></label>
            <input type="text" id="nombre" name="nombre" placeholder="Nombre del destinatario" required />
          </div>

          <div className="field">
            <label htmlFor="direccion">DIRECCIÓN DE ENTREGA <em>*</em></label>
            <input type="text" id="direccion" name="direccion" placeholder="Calle, carrera, número..." required />
          </div>

          <div className="row two">
            <div className="field">
              <label htmlFor="ciudad">CIUDAD <em>*</em></label>
              <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad" required />
            </div>

            <div className="field">
              <label htmlFor="telefono">TELÉFONO <em>*</em></label>
              <input type="tel" id="telefono" name="telefono" placeholder="Número de contacto" required />
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
            <select id="medio" name="medio" required>
              <option value="">Selecciona una opción</option>
              <option value="Tarjeta de crédito">Tarjeta de crédito</option>
              <option value="Tarjeta débito">Tarjeta débito</option>
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

        <button type="button" className="submit">
          PAGAR AHORA <span>→</span>
        </button>

        <p className="terms">
          AL CONTINUAR, CONFIRMAS QUE LOS DATOS DE TU PEDIDO SON CORRECTOS.
        </p>
      </form>
    </section>
  )
}
