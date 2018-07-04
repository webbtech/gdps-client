/* eslint no-undef: "off" */

import * as actions from '../errorActions'
import reducer from '../errorReducer'

describe('todos reducer', () => {

  const time = new Date().getTime()
  const time2 = time + 1
  let state = [
    {
      message: 'First message',
      id: time,
    },
    {
      message: 'Second message',
      id: time2,
    },
  ]

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([])
  })

  it('should handle ERROR_SEND', () => {

    expect(
      reducer([], {
        type: actions.ERROR_SEND,
        payload: {
          message: 'Run the tests',
          id: time,
        },
      })
    ).toEqual([
      {
        message: 'Run the tests',
        id: time,
      },
    ])

    expect(
      reducer(
        [
          {
            message: 'Existing message',
            id: time,
          },
        ],
        {
          type: actions.ERROR_SEND,
          payload: {
            message: 'Run the tests',
            id: time2,
          },
        }
      )
    ).toEqual([
      {
        message: 'Run the tests',
        id: time2,
      },
      {
        message: 'Existing message',
        id: time,
      },
    ])

  })

  it('should dismiss error', () => {
    expect(
      reducer(
        state,
        {
          type: actions.ERROR_DISMISS,
          payload: time,
        }
      )
    ).toEqual(state.slice(1))
  })

  it('should clear all errors', () => {
    expect(
      reducer(
        state,
        { type: actions.ERROR_CLEAR }
      )
    ).toEqual([])
  })

})