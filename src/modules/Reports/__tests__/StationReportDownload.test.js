/* eslint no-undef: "off" */

import React from 'react'

import StationReportDownload from '../StationReportDownload'
import { shallow } from 'enzyme'

describe('StationReportDownload', () => {
  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(<StationReportDownload {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: { pathname: '/' },
      match: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(testC()).toMatchSnapshot()
  })
})
