/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import StationInfo from '../StationInfo'

describe('StationInfo', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<StationInfo {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {}
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})