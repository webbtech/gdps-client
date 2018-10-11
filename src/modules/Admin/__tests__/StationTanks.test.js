/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import StationTanks from '../StationTanks.cntr'

describe('StationTanks', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <StationTanks {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      // authState: 'confirmSignIn',
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})