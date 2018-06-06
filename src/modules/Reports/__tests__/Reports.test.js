/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'

import { shallow } from 'enzyme'
import Reports from '../Reports'

describe('Reports', () => {
  let mountedC
  let props
  const reportsC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Router><Reports {...props} /></Router>
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      match: {},
      history: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportsC()).toMatchSnapshot()
  })

})
