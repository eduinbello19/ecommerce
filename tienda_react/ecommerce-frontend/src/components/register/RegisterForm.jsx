import { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordStrength from './PasswordStrength'
import SizeSelector from './SizeSelector'
import SocialButtons from './SocialButtons'
import { crearUsuario, describeRegistrationError } from '../../services/usuarioService'
import { isValidPassword } from '../../utils/password'

const INITIAL_FORM = {
  nombres: '',
  apellidos: '',
  correo: '',
  documento: '',
  movil: '',
  ciudad: '',
  clave: '',
  clave2: '',
  talla: 'M',
  alertas: true,
  terminos: false,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  const celular = form.movil.replace(/\D/g, '')

  if (!form.nombres.trim()) errors.nombres = 'Ingresa tus nombres.'
  if (!form.apellidos.trim()) errors.apellidos = 'Ingresa tus apellidos.'
  if (!EMAIL_PATTERN.test(form.correo.trim())) errors.correo = 'Ingresa un correo válido.'
  if (!/^\d{6,20}$/.test(form.documento.trim())) {
    errors.documento = 'Ingresa un documento de 6 a 20 dígitos.'
  }
  if (!/^\d{10}$/.test(celular)) errors.movil = 'Ingresa un celular de 10 dígitos.'
  if (form.clave.length > 25) {
    errors.clave = 'Máximo 25 caracteres.'
  } else if (!isValidPassword(form.clave)) {
    errors.clave = 'Mínimo 8 caracteres con letras, números y un carácter especial.'
  }
  if (form.clave !== form.clave2) errors.clave2 = 'Las contraseñas no coinciden.'
  if (!form.terminos) errors.terminos = 'Debes aceptar los términos y la política de privacidad.'

  return errors
}

export default function RegisterForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState('')

  const handleChange = (event) => {
    const { id, type, value, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm((current) => ({ ...current, [id]: nextValue }))
    setErrors((current) => ({ ...current, [id]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setServerMessage('')

    try {
      await crearUsuario({
        nombre: form.nombres.trim(),
        apellido: form.apellidos.trim(),
        correo: form.correo.trim(),
        documento: form.documento.trim(),
        claveHash: form.clave,
        celular: form.movil.replace(/\D/g, ''),
        tallaHabitual: form.talla,
      })
      setStatus('success')
      setServerMessage('Tu cuenta fue creada correctamente.')
    } catch (error) {
      setStatus('error')
      setServerMessage(describeRegistrationError(error))
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2><i></i>DATOS DE REGISTRO</h2>
        <span>[BOG/MDE/CLO/BAQ]</span>
      </div>

      <form id="register" noValidate onSubmit={handleSubmit}>
        <div className="row two">
          <div className="field">
            <label htmlFor="nombres">NOMBRES <em>•</em></label>
            <input
              id="nombres"
              type="text"
              placeholder="Ej. Mateo"
              autoComplete="given-name"
              value={form.nombres}
              onChange={handleChange}
            />
            {errors.nombres && <p className="field-error">{errors.nombres}</p>}
          </div>
          <div className="field">
            <label htmlFor="apellidos">APELLIDOS <em>•</em></label>
            <input
              id="apellidos"
              type="text"
              placeholder="Ej. Restrepo Cruz"
              autoComplete="family-name"
              value={form.apellidos}
              onChange={handleChange}
            />
            {errors.apellidos && <p className="field-error">{errors.apellidos}</p>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="correo">CORREO ELECTRÓNICO <em>•</em></label>
          <input
            id="correo"
            type="email"
            placeholder="identidad@dominio.co"
            autoComplete="email"
            value={form.correo}
            onChange={handleChange}
          />
          {errors.correo && <p className="field-error">{errors.correo}</p>}
        </div>

        <div className="field">
          <label htmlFor="documento">DOCUMENTO DE IDENTIDAD <em>•</em></label>
          <input
            id="documento"
            type="text"
            inputMode="numeric"
            placeholder="Ej. 1023456789"
            value={form.documento}
            onChange={handleChange}
          />
          {errors.documento && <p className="field-error">{errors.documento}</p>}
        </div>

        <div className="row phone-row">
          <div className="field">
            <label htmlFor="movil">MÓVIL SMS DROPS (+57 COLOMBIA) <em>•</em></label>
            <div className="phone">
              <span>+57</span>
              <input
                id="movil"
                type="tel"
                placeholder="300 000 0000"
                autoComplete="tel-national"
                value={form.movil}
                onChange={handleChange}
              />
            </div>
            {errors.movil && <p className="field-error">{errors.movil}</p>}
          </div>
          <div className="field">
            <label htmlFor="ciudad">CIUDAD DESPACHO <em>•</em></label>
            <select id="ciudad" value={form.ciudad} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option>Bogotá</option>
              <option>Medellín</option>
              <option>Cali</option>
              <option>Barranquilla</option>
            </select>
          </div>
        </div>

        <div className="row two">
          <div className="field">
            <label htmlFor="clave">CONTRASEÑA SEGURA <em>•</em></label>
            <input
              id="clave"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={form.clave}
              onChange={handleChange}
            />
            {errors.clave && <p className="field-error">{errors.clave}</p>}
          </div>
          <div className="field">
            <label htmlFor="clave2">CONFIRMAR CONTRASEÑA <em>•</em></label>
            <input
              id="clave2"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={form.clave2}
              onChange={handleChange}
            />
            {errors.clave2 && <p className="field-error">{errors.clave2}</p>}
          </div>
        </div>

        <PasswordStrength value={form.clave} />
        <SizeSelector
          value={form.talla}
          onChange={(talla) => {
            setForm((current) => ({ ...current, talla }))
          }}
        />

        <label className="check">
          <input id="alertas" type="checkbox" checked={form.alertas} onChange={handleChange} />
          <span className="box"></span>
          <span className="text">
            Deseo recibir claves de acceso anticipado 15 minutos antes vía WhatsApp/SMS antes del lanzamiento oficial.
          </span>
        </label>

        <label className="check">
          <input id="terminos" type="checkbox" checked={form.terminos} onChange={handleChange} />
          <span className="box"></span>
          <span className="text">
            Acepto los <a href="#">Términos de Servicio</a> y la <a href="#">Política de Privacidad</a> de KULT STUDIO Colombia.
          </span>
        </label>
        {errors.terminos && <p className="field-error check-error">{errors.terminos}</p>}

        {status === 'error' && (
          <p className="form-message error" role="alert">{serverMessage}</p>
        )}
        {status === 'success' && (
          <p className="form-message success" role="status">
            {serverMessage} <Link to="/login">[INICIAR SESIÓN AQUÍ]</Link>
          </p>
        )}

        <button className="submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'ENVIANDO INFORMACIÓN...' : 'CREAR IDENTIFICADOR DE MIEMBRO'}
          <span>→</span>
        </button>

        <SocialButtons />

        <p className="login">
          ¿YA POSEES IDENTIFICADOR DE ACCESO? <Link to="/login">[INICIAR SESIÓN AQUÍ]</Link>
        </p>
      </form>
    </section>
  )
}
