export function getStrengthLevel(value) {
  if (!value) return 0

  let level = 0
  if (value.length > 0) level = 1
  if (value.length >= 8) level++
  if (/[A-Za-z]/.test(value) && /\d/.test(value)) level++
  if (/[^A-Za-z0-9]/.test(value)) level++

  return value.length === 0 ? 0 : level
}

export function isValidPassword(value) {
  return (
    value.length >= 8 &&
    /[A-Za-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}

export async function hashPassword(value) {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')

  return hex.slice(0, 25)
}
