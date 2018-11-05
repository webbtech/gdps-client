/* eslint no-undef: "off" */

import * as futils from './formUtils'
import { RECORDS_START_YEAR as startYear } from '../config/constants'

describe('setMonths', () => {
  it('returns 12 months', () => {
    const months = futils.setMonths()
    expect(months.length).toEqual(12)
  })
})

describe('setYears', () => {
  it('returns accurate number years', () => {
    const yrs = futils.setYears()
    const curYear = (new Date()).getFullYear()
    const noYrs = curYear - startYear + 1
    expect(yrs.length).toEqual(noYrs)
    expect(yrs[0]).toEqual(curYear)
  })
})
