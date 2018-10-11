/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Loader from '../Loader'

describe('Loader', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Loader {...props} />
      )
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