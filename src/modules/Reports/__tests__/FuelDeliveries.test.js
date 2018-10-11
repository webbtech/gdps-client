/* eslint no-undef: "off" */

import React from 'react'

import FuelDeliveries from '../FuelDeliveries'
import { shallow } from 'enzyme'

describe('FuelDeliveries', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <FuelDeliveries {...props} />
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