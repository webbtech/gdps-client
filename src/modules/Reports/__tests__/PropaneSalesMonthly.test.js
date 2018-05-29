/* eslint no-undef: "off" */

import React from 'react'
import PropaneSalesMonthly from '../PropaneSalesMonthly'
import { render } from 'enzyme'

describe('PropaneSalesMonthly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = render(
        <PropaneSalesMonthly {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: {pathname: '/'},
      match: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(testC()).toMatchSnapshot()
  })

})