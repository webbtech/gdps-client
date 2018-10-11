/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import ImportLog from '../ImportLog'

describe('ImportLog', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <ImportLog {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      importType: '',
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})