import { ERROR_SEND, ERROR_DISMISS, ERROR_CLEAR } from './errorActions'

export default function errorReducer(state = [], action) {

  if (!action || !action.type) return state

  switch (action.type) {
  case ERROR_SEND:
    console.log('state: ', state)
    return [action.payload, ...state]

  case ERROR_DISMISS:
    return state.filter(error => error.id !== action.payload)

  case ERROR_CLEAR:
    return []

  default:
    return state
  }
}
