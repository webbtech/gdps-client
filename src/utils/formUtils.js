import { RECORDS_START_YEAR as startYear } from '../config/constants'
import moment from 'moment'

Array.range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start)

export const setMonths = () => {
  let months = []
  for (let i=0; i < 12; i++) {
    const dte = moment(new Date(0, i))
    months.push({key: dte.format('MM'), label: dte.format('MMMM')})
  }
  return months
}

export const setYears = () => {
  const curYear = (new Date()).getFullYear()
  const years = Array.range(startYear, curYear)
  return years.reverse()
}