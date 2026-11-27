const CHECKOUT_ENDPOINT = '/api/checkout'
const CHECKOUT_ERROR_MESSAGE = 'No fue posible registrar el pedido. Intente más tarde.'

export async function registrarCheckout(payload) {
  const response = await fetch(CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.ok) return response.json()

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(CHECKOUT_ERROR_MESSAGE)
  }

  throw new Error(data?.message || CHECKOUT_ERROR_MESSAGE)
}
