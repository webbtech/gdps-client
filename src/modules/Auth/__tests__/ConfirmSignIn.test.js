/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'

import ConfirmSignIn from '../ConfirmSignIn'

describe('ConfirmSignIn', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render(<Router><ConfirmSignIn {...props} /></Router>)
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      authState: 'confirmSignIn',
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
