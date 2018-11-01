/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import ImportForm from '../ImportForm'

describe('ImportForm', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(<ImportForm {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: { location: { pathname: '/' } },
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })
})
