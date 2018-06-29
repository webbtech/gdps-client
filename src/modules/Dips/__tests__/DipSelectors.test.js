/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { shallow } from 'enzyme'

import DipSelectors from '../DipSelectors'

describe('DipSelectors', () => {

  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = shallow(
        <Router><DipSelectors {...props} /></Router>
      )
    }
    return mountedC
  }

  beforeEach(() => {
    props = {
      history: {},
      location: {},
      match: {},
      // client: {}
    }
    mountedC = undefined
  })

  /*it('always renders a div', () => {
    const divs = reportC().find('div')
    expect(divs.length).toBeGreaterThan(0)
  })*/

  it('matches snapshot', () => {
    expect(reportC()).toMatchSnapshot()
  })

})