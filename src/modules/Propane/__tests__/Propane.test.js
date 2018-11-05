/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Propane from '../Propane'

describe('Propane', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<Propane {...props} />)
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
