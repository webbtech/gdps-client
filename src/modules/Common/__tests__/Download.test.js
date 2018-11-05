/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Download from '../Download'

describe('Download', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<Download {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })
})
