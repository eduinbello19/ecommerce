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
