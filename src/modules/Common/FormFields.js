import React from 'react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField'

export const RenderTextField = ({ defaultValue, input, meta: { touched, error }, ...others }) => { // eslint-disable-line react/no-multi-comp
  return (
    <TextField
        {...others}
        {...input}
        defaultValue={defaultValue}
        error={touched && !!error}
        // errorText={error}
        // onChange={input.onChange}
    />
  )
}
RenderTextField.propTypes = {
  defaultValue:  PropTypes.string,
  input:  PropTypes.object,
  meta:   PropTypes.object,
}

export const RenderFileField = ({ input, meta: { touched, error }, ...others }) => { // eslint-disable-line react/no-multi-comp
  // console.log('others: ', others)
  // console.log('input: ', input)
  delete input.value
  return (
    <TextField
        {...others}
        {...input}
        // defaultValue={defaultValue}
        error={touched && !!error}
        // errorText={error}
        // onChange={input.onChange}
    />
  )
}
RenderFileField.propTypes = {
  defaultValue:  PropTypes.string,
  input:  PropTypes.object,
  meta:   PropTypes.object,
}

// =========================== Utilities =========================== //

export const required = value => (value ? undefined : 'Field Required')