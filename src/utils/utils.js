// todo: handle empty or invalid input

import moment from 'moment'

export const extractPathParts = (pathname, start = 2) => {
  const prts = pathname.split('/')
  if (prts.length < start + 1) return null

  return prts.slice(start)
}

export const dateToInt = (dateStr) => {
  const dte = moment(dateStr)
  if (!dte.isValid()) return null

  const date = dateStr.split('-').join('')
  return parseInt(date, 10)
}

export const dateNextDay = (dateStr) => {
  const dte = moment(dateStr)
  if (!dte.isValid()) return null

  const nextDay = dte.add(1, 'days').format('YYYYMMDD')
  return parseInt(nextDay, 10)
}

export const datePrevDay = (dateStr) => {
  const dte = moment(dateStr)
  if (!dte.isValid()) return null

  const prevDay = dte.subtract(1, 'days').format('YYYYMMDD')
  return parseInt(prevDay, 10)
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

export const setOrderedFuelTypes = (fuelTypes, fuelTypeList) => fuelTypeList.filter(ft => fuelTypes.includes(ft))

export const ucFirst = word => word.charAt(0).toUpperCase() + word.slice(1)
