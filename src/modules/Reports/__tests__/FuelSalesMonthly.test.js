/* eslint no-undef: "off" */

import React from 'react'
import FuelSalesMonthly from '../FuelSalesMonthly'
import { render } from 'enzyme'

describe('FuelSalesMonthly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = render(
        <FuelSalesMonthly {...props} />
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