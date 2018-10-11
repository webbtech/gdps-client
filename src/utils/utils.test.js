/* eslint no-undef: "off" */

// To test this file, use: npm test -- utils-test

import { dateNextDay, datePrevDay, dateToInt, extractPathParts, fmtNumber, setOrderedFuelTypes } from './utils'

describe('dateToInt', () => {

  it('return an integer date', () => {
    let intDte = dateToInt('2018-03-04')
    expect(intDte).toEqual(20180304)
  })

  it('returns a null date', () => {
    let intDte = dateToInt('2018-03-34')
    expect(intDte).toBeNull()
  })
})

describe('datePrevDay', () => {

  it('returns previous day integer', () => {
    let prevDay = datePrevDay('2018-05-29')
    expect(prevDay).toEqual(20180528)
  })

  it('returns null', () => {
    let prevDay = datePrevDay('2018-05-34')
    expect(prevDay).toBeNull()
  })
})

describe('dateNextDay', () => {

  it('returns next day integer', () => {
    let nextDay = dateNextDay('2018-05-29')
    expect(nextDay).toEqual(20180530)
  })

  it('returns null', () => {
    let nextDay = dateNextDay('2018-05-34')
    expect(nextDay).toBeNull()
  })
})


describe('extractPathParts', () => {

  const path = '/dips/2018-05-30/c9d27fe9-9b0e-450c-9f2e-149a55d0a881'

  it('returns 2 parts', () => {
    const prts = extractPathParts(path)
    expect(prts).toHaveLength(2)
  })

  it('returns 3 parts', () => {
    const prts = extractPathParts(path, 1)
    expect(prts).toHaveLength(3)
  })

  it('returns date part', () => {
    const prts = extractPathParts(path)
    expect(prts[0]).toEqual('2018-05-30')
  })

  it('returns null', () => {
    const prts = extractPathParts('/ff')
    expect(prts).toBeNull()
  })
})

describe('fmtNumber', () => {

  const number = 12345.06789

  it('returns formatted number with 2 decimal places', () => {
    const num = fmtNumber(number)
    expect(num).toEqual('12345.07')
  })

  it('returns formatted number with 3 decimal places', () => {
    const num = fmtNumber(number, 3)
    expect(num).toEqual('12345.068')
  })

  it('returns formatted number with 1 decimal places', () => {
    const num = fmtNumber(number, 1)
    expect(num).toEqual('12345.1')
  })

  it('returns formatted number with comma', () => {
    const num = fmtNumber(number, 2, true)
    expect(num).toEqual('12,345.07')
  })

  it('returns 0.00 from empty input', () => {
    const num = fmtNumber('')
    expect(num).toEqual('0.00')
  })

  it('returns currency formatted number', () => {
    const num = fmtNumber(number, 2, true, true)
    expect(num).toEqual('$12,345.07')
  })

  it('returns null', () => {
    const num = fmtNumber()
    expect(num).toBeNull()
  })
})

describe('setOrderedFuelTypes', () => {
  const { FUEL_TYPE_LIST } = require('../config/constants')
  const fuelTypes = ['DSL', 'NL', 'SNL', 'CDSL']
  const fuelTypes2 = ['DSL', 'NL', 'SNL']

  it('return ordered fuel types', () => {
    const fts = setOrderedFuelTypes(fuelTypes, FUEL_TYPE_LIST)
    expect(fts).toEqual(['NL', 'SNL', 'DSL', 'CDSL'])
  })

  it('return 3 ordered fuel types', () => {
    const fts = setOrderedFuelTypes(fuelTypes2, FUEL_TYPE_LIST)
    expect(fts).toEqual(['NL', 'SNL', 'DSL'])
  })
})
