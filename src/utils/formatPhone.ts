export default function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  const slice = digits.length > 10 ? digits.slice(-10) : digits

  if (slice.length !== 10) {
    return null
  }

  const area = slice.slice(0, 3)
  const mid = slice.slice(3, 6)
  const end = slice.slice(6)
  return `(${area}) ${mid}-${end}`
}