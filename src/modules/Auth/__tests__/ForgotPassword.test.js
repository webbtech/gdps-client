/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import ForgotPassword from '../ForgotPassword'

describe('ForgotPassword', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<ForgotPassword {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      authState: 'forgotPassword',
      onStateChange: () => {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })
})
