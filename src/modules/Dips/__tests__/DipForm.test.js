/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import DipForm from '../DipForm.cntr'

describe('DipForm', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <DipForm {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: {},
      match: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})