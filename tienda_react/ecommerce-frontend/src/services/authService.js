const LOGIN_ENDPOINT = '/api/usuario/login'

export const LOGIN_ERROR_MESSAGE = 'Correo invalido o clave erronea vuelvalo a intentar'

export async function validarCredenciales({ correo, claveHash }) {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, claveHash }),
  })

  if (response.ok) {
    try {
      return (await response.json()) || true
    } catch {
      return true
    }
  }
  if (response.status === 401) throw new Error(LOGIN_ERROR_MESSAGE)

  throw new Error('No fue posible conectar con el servidor. Intente más tarde.')
}
