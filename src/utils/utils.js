// todo: handle empty or invalid input


export const extractPathParts = (pathname, start = 2) => {
  const prts = pathname.split('/')
  if (prts.length < start + 1) return null

  return prts.slice(start)
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const fmtNumber = (number, decimal = 2, useGrouping = false, currency = false) => {
  if (number === undefined) return null

  const opts = {
    useGrouping,
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  }
  if (currency) {
    opts.style = 'currency'
    opts.currency = 'USD'
  }
  const formatter = new Intl.NumberFormat('en-US', opts)
  return formatter.format(number)
}

export const setOrderedFuelTypes =
  (fuelTypes, fuelTypeList) => fuelTypeList.filter(ft => fuelTypes.includes(ft))

export const ucFirst = word => word.charAt(0).toUpperCase() + word.slice(1)

export function getEnv() {
  if (window.location.hostname.indexOf('stage') > -1) {
    return 'stage'
  }
  return process.env.NODE_ENV
}

export function getTitle() {
  const env = getEnv()

  const mainTitle = 'Gales Dips'
  let title = ''
  switch (env) {
    case 'development':
      title = `${mainTitle} \u00b7 Dev`
      break
    case 'stage':
      title = `${mainTitle} \u00b7 Staging`
      break
    case 'production':
      title = `${mainTitle} \u00b7 Live`
      break
    default:
      title = mainTitle
  }
  return title
}
