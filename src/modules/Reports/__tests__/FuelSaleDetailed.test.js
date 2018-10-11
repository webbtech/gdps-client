/* eslint no-undef: "off" */

import React from 'react'

import FuelSalesDetailed from '../FuelSalesDetailed'
import { shallow } from 'enzyme'

describe('FuelSalesDetailed', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <FuelSalesDetailed {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: {pathname: '/'},
      match: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(testC()).toMatchSnapshot()
  })

})