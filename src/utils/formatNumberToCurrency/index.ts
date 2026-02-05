import isNumber from "../isNumber";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatNumberToCurrency = (num: any, currency: Intl.NumberFormatOptions["currency"] = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(isNumber(num) ? num : 99999)
}


export default formatNumberToCurrency;