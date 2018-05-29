/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter } from 'react-router'
import { shallow } from 'enzyme'
import Reports from '../Reports'

describe('Reports', () => {
  let mountedC
  let props
  const reportsC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <MemoryRouter><Reports {...props} /></MemoryRouter>
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
