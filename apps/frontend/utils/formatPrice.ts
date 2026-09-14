export const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return 'Rs. 2,500'
  const str = String(val).replace(/[^0-9.]/g, '')
  const num = parseFloat(str)
  if (isNaN(num) || num === 0) return 'Rs. 2,500'
  let p = num
  if (p < 500) {
    p = p * 280
  }
  return 'Rs. ' + Math.round(p).toLocaleString('en-US')
}
