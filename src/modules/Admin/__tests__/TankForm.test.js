/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import TankForm from '../TankForm.cntr'

describe('TankForm', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <TankForm {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})