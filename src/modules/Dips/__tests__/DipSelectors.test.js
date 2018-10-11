/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import DipSelectors from '../DipSelectors'

describe('DipSelectors', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <DipSelectors {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      actions: {},
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