/* eslint no-undef: "off" */

import React from 'react'
import { render } from 'enzyme'

import Error from '../Error'

describe('Error', () => {

  let mountedC
  let props
  const component = () => {
    if (!mountedC) {
      mountedC = render(
        <Error {...props} />
      )
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

  /*it('always renders a div', () => {
    console.log('component: ', component())
    const divs = component().find('div')
    expect(divs.length).toBeGreaterThan(0)
  })*/

  it('matches snapshot', () => {
    expect(component()).toMatchSnapshot()
  })

})