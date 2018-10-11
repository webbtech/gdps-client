/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Alert from '../Alert'

describe('Alert', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Alert {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      authState: 'forgotPassword',
      onStateChange: () => {},
      children: '',
      type: '',
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})