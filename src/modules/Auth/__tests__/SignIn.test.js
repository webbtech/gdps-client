/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'

import SignIn from '../SignIn'

describe('SignIn', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render(<Router><SignIn {...props} /></Router>)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      authState: 'signIn',
      onStateChange: () => {},
    }
    mountedC = undefined
  })

  it('always renders a div', () => {
    const divs = reportC().find('div')
    expect(divs.length).toBeGreaterThan(0)
  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })
})
