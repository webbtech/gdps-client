/* eslint no-undef: "off" */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from 'enzyme'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider'

import PropaneSelectors from '../PropaneSelectors'

describe('PropaneSelectors', () => {
  let mountedC
  let props
  const reportC = () => {
    if (!mountedC) {
      mountedC = render( // eslint-disable-line
        <Router>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <PropaneSelectors {...props} />
          </MuiPickersUtilsProvider>
        </Router>
      ) // eslint-disable-line
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
