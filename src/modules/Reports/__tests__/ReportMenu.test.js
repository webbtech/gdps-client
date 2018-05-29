/* eslint no-undef: "off" */

import React from 'react'
import ReportMenu from '../ReportMenu'
import { render } from 'enzyme'

describe('ReportMenu', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render(
        <ReportMenu {...props} />
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