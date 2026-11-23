const API_BASE = '/api'

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    const error = new Error(`No fue posible cargar ${path}.`)
    error.status = response.status
    throw error
  }

  return response.json()
}

export async function obtenerCatalogo() {
  const [categorias, productos, variantes] = await Promise.all([
    request('/categoria'),
    request('/producto'),
    request('/variante'),
  ])

  return { categorias, productos, variantes }
}
