/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'

import DipOverShort from '../DipOverShort'

describe('DipOverShort', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render(
        <Router><DipOverShort {...props} /></Router>
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