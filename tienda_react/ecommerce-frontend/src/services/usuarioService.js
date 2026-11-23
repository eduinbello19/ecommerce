const USUARIO_ENDPOINT = '/api/usuario'

export async function crearUsuario(payload) {
  const response = await fetch(USUARIO_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'No fue posible completar el registro.')
    error.status = response.status
    throw error
  }

  return data
}

export function describeRegistrationError(error) {
  if (error.status === 400) {
    return 'Revisa los campos del formulario e inténtalo de nuevo.'
  }
  if (error.status === 500) {
    return 'El correo o documento ya están registrados, o el servicio no está disponible.'
  }
  return 'No fue posible conectar con el servidor. Verifica que la API esté activa.'
}
