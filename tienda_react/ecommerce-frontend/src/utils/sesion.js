const CLAVE_SESION = 'sesion'

function leerSesion(storage) {
  try {
    const contenido = storage.getItem(CLAVE_SESION)
    if (!contenido) return null

    const datos = JSON.parse(contenido)
    return datos && typeof datos === 'object' ? datos : null
  } catch {
    return null
  }
}

export function guardarSesion(usuario, recordar) {
  const sesion = {
    idUsuario: usuario?.idUsuario ?? null,
    correo: usuario?.correo ?? '',
    nombre: usuario?.nombre ?? '',
  }
  const destino = recordar ? localStorage : sessionStorage
  const alterno = recordar ? sessionStorage : localStorage

  destino.setItem(CLAVE_SESION, JSON.stringify(sesion))
  alterno.removeItem(CLAVE_SESION)
}

export function obtenerSesion() {
  return leerSesion(localStorage) || leerSesion(sessionStorage)
}

export function obtenerIdUsuario() {
  return obtenerSesion()?.idUsuario ?? null
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
  sessionStorage.removeItem(CLAVE_SESION)
}
