/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Toaster from '../Toaster'

describe('Toaster', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Toaster {...props} />
      )
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