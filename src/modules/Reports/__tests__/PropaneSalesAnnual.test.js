/* eslint no-undef: "off" */

import React from 'react'

import PropaneSalesAnnual from '../PropaneSalesAnnual'
import { shallow } from 'enzyme'

describe('PropaneSalesAnnual', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <PropaneSalesAnnual {...props} />
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