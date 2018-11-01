/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import StationSelector from '../StationSelector'

describe('StationSelector', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<StationSelector {...props} />)
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
