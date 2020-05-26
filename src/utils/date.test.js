// To test file: yarn test src/utils/date.test.js

import { dateNextDay, datePrevDay, dateToInt } from './date'

describe('dateToInt', () => {
  it('return an integer date', () => {
    const intDte = dateToInt('2018-03-04')
    expect(intDte).toEqual(20180304)
  })

  it('returns a null date', () => {
    const intDte = dateToInt('2018-03-34')
    expect(intDte).toBeNull()
  })
})

describe('datePrevDay', () => {
  it('returns previous day integer', () => {
    const prevDay = datePrevDay('2018-05-29')
    expect(prevDay).toEqual(20180528)
  })

  it('returns null', () => {
    const prevDay = datePrevDay('2018-05-34')
    expect(prevDay).toBeNull()
  })
})

describe('dateNextDay', () => {
  it('returns next day integer', () => {
    const nextDay = dateNextDay('2018-05-29')
    expect(nextDay).toEqual(20180530)
  })

  it('returns null', () => {
    const nextDay = dateNextDay('2018-05-34')
    expect(nextDay).toBeNull()
  })
})
