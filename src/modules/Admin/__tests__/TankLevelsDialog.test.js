/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import TankLevelsDialog from '../TankLevelsDialog'

describe('TankLevelsDialog', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <TankLevelsDialog {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      tank: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})