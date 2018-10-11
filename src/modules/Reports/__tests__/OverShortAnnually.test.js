/* eslint no-undef: "off" */

import React from 'react'

import OverShortAnnually from '../OverShortAnnually'
import { shallow } from 'enzyme'

describe('OverShortAnnually', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <OverShortAnnually {...props} />
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