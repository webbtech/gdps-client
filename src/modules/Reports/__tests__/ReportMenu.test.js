/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'

import ReportMenu from '../ReportMenu'

describe('ReportMenu', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render(
        <Router><ReportMenu {...props} /></Router>
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {location: {pathname: '/'}},
      match: {},
    }
    mountedC = undefined
  })

  it('always renders a div', () => {
    const divs = reportC().find('div')
    expect(divs.length).toBeGreaterThan(0)
  })

  it('renders correct number of buttons', () => {
    const buttons = reportC().find('button')
    expect(buttons).toHaveLength(4)

  })

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})