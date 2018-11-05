/* eslint no-undef: "off" */

import React from 'react'

import FuelSalesList from '../FuelSalesList'
import { shallow } from 'enzyme'

describe('FuelSalesList', () => {
  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(<FuelSalesList {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: { pathname: '/' },
      match: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(testC()).toMatchSnapshot()
  })
})
