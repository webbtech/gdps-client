/* eslint no-undef: "off" */

import React from 'react'
import { shallow } from 'enzyme'

import PropaneForm from '../PropaneForm'

describe('PropaneForm', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <PropaneForm {...props} />
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      dirty: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      history: {},
      isSubmitting: false,
      location: {},
      values: {},
    }
    mountedC = undefined
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})