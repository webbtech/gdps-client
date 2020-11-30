export const ERROR_SEND = 'ERROR_SEND'
export const ERROR_DISMISS = 'ERROR_DISMISS'
export const ERROR_CLEAR = 'ERROR_CLEAR'

/**
 * Publish an error alert,
 */
export function errorSend(error) {
  const thisError = { ...error }
  if (!error.id) {
    thisError.id = new Date().getTime()
  }
  return { type: ERROR_SEND, payload: thisError }
}

/**
 * Dismiss an error by the given id.
 */
export function errorDismiss(id) {
  return { type: ERROR_DISMISS, payload: id }
}

/**
 * Clear all errors
 */
export function errorClear() {
  return { type: ERROR_CLEAR }
}
