/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Dips from '../Dips.cntr'

describe('Dips', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Dips {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: {pathname: '/'},
      match: {
        params: {
          date: '',
        },
      },
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})