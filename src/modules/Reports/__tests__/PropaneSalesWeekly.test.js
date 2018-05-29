/* eslint no-undef: "off" */

import React from 'react'
import PropaneSalesWeekly from '../PropaneSalesWeekly'
import { render } from 'enzyme'

describe('PropaneSalesWeekly', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = render(
        <PropaneSalesWeekly {...props} />
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