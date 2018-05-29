/* eslint no-undef: "off" */

import React from 'react'
import FuelSalesWeekly from '../FuelSalesWeekly'
import { render } from 'enzyme'

describe('FuelSalesWeekly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = render(
        <FuelSalesWeekly {...props} />
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