/* eslint no-undef: "off" */

import React from 'react'

import PropaneSalesMonthly from '../PropaneSalesMonthly'
import { shallow } from 'enzyme'

describe('PropaneSalesMonthly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <PropaneSalesMonthly {...props} />
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