/* eslint no-undef: "off" */

import React from 'react'

import PropaneReportDownload from '../PropaneReportDownload'
import { shallow } from 'enzyme'

describe('PropaneReportDownload', () => {
  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = shallow(<PropaneReportDownload {...props} />)
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
