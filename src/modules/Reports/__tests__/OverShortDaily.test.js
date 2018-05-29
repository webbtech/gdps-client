/* eslint no-undef: "off" */

import React from 'react'
import OverShortDaily from '../OverShortDaily'
import { render } from 'enzyme'

describe('OverShortDaily', () => {

  let mountedC
  let props
  const testC = () => {
    if (!mountedC) {
      mountedC = render(
        <OverShortDaily {...props} />
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