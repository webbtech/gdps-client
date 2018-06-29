export const ERROR_SEND = 'ERROR_SEND'
export const ERROR_DISMISS = 'ERROR_DISMISS'
export const ERROR_CLEAR = 'ERROR_CLEAR'

/**
 * Publish an error alert,
 */
export function errorSend(error) {
  if (!error.id) {
    error.id = new Date().getTime()
  }
  /*return dispatch => {
    dispatch({ type: ERROR_SEND, payload: error })
  }*/
  // console.log('error in errorSend: ', error)
  return { type: ERROR_SEND, payload: error}
}

/**
 * Dismiss an error by the given id.
 */
export function errorDismiss(id) {
  console.log('errorDismiss: ', id)
  return { type: ERROR_DISMISS, payload: id }
}

/**
 * Clear all errors
 */
export function errorClear() {
  return { type: ERROR_CLEAR }
}