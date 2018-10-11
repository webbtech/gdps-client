/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import AddTankDialog from '../AddTankDialog'

describe('AddTankDialog', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <AddTankDialog {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      stationID: '',
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})