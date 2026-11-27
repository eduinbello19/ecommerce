import { obtenerSesion } from '../../utils/sesion'

export default function UsuarioEstado() {
  const sesion = obtenerSesion()

  if (!sesion?.idUsuario || !sesion.nombre) return null

  return (
    <span className="usuario-estado" aria-label={`Sesión iniciada: ${sesion.nombre}`} title={`Sesión iniciada: ${sesion.nombre}`}>
      <span aria-hidden="true">●</span> HOLA, {sesion.nombre}
    </span>
  )
}
