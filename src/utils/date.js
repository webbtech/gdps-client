import moment from 'moment'

export const dateToInt = (dateStr) => {
  const dte = moment(dateStr)
  if (!dte.isValid()) return null

  const date = dateStr.split('-').join('')
  return parseInt(date, 10)
}

/**
 * Returns a moment object from number
 * @param {number} date - number as YYYYMMDD
 * @returns {moment} - Moment object
 */
export function numberToMoment(date) {
  const dteStr = date.toString()
  const year = dteStr.substring(0, 4)
  const month = dteStr.substring(4, 6)
  const day = dteStr.substring(6)
  const dte = moment().year(year).month(Number(month) - 1).date(day)
  return dte
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
