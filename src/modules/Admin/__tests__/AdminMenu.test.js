/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import AdminMenu from '../AdminMenu'

describe('AdminMenu', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <AdminMenu {...props} />
      )
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