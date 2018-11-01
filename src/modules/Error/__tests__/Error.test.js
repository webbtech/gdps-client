/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import Error from '../Error'

describe('Error', () => {
  let mountedC
  let props
  const component = () => {
    if (!mountedC) {
      mountedC = shallow(<Error {...props} />)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      message: '',
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(component()).toMatchSnapshot()
  })
})
