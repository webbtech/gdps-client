/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import ChangePassword from '../ChangePassword'

describe('ChangePassword', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<ChangePassword {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {}
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })
})
