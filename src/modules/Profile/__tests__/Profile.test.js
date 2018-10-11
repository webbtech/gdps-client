/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Profile from '../Profile'

describe('Profile', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Profile {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {location: {pathname: '/'}},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})