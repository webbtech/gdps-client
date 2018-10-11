/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import ImportData from '../ImportData'

describe('ImportData', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <ImportData {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {location: {pathname: '/'}},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})