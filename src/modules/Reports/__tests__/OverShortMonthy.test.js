/* eslint no-undef: "off" */

import React from 'react'

import OverShortMonthly from '../OverShortMonthly'
import { shallow } from 'enzyme'

describe('OverShortMonthly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <OverShortMonthly {...props} />
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