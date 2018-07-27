/* eslint no-undef: "off" */

import * as actions from '../errorActions'
// import reducer from '../errorReducer'

describe('actions', () => {

  it('should create an action to add an error', () => {

    const message = 'Finish docs'
    const time = new Date().getTime()
    const expectedError = {
      id: time,
      message,
    }
    const ret = actions.errorSend({message, id: time})
    expect(ret.payload).toEqual(expectedError)

    // const ret2 = actions.errorSend({message: 'Second error msg', id: time + 1})
    // console.log('ret2: ', ret2)

  })
})