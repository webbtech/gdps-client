/* eslint no-undef: "off" */

// To test file: yarn test src/utils/utils.test.js

import {
  extractPathParts,
  fmtNumber,
  getEnv,
  getTitle,
  setOrderedFuelTypes,
} from './utils'

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
  const { FUEL_TYPE_LIST } = require('../config/constants') // eslint-disable-line global-require
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

describe('setEnv', () => {
  it('return development environment', () => {
    process.env.NODE_ENV = 'development'
    const env = getEnv()
    expect(env).toEqual('development')
  })

  it('return stage environment', () => {
    process.env.NODE_ENV = 'stage'
    const env = getEnv()
    expect(env).toEqual('stage')
  })

  it('return test environment', () => {
    process.env.NODE_ENV = 'production'
    const env = getEnv()
    expect(env).toEqual('production')
  })
})

describe('setTitle', () => {
  it('return development title', () => {
    process.env.NODE_ENV = 'development'
    const title = getTitle()
    expect(title).toEqual('Gales Dips · Dev')
  })

  it('return staging title', () => {
    process.env.NODE_ENV = 'stage'
    const title = getTitle()
    expect(title).toEqual('Gales Dips · Staging')
  })

  it('return production title', () => {
    process.env.NODE_ENV = 'production'
    const title = getTitle()
    expect(title).toEqual('Gales Dips · Live')
  })
})
