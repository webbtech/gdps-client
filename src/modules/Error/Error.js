import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Icon from '@material-ui/core/Icon'


const Error = ({ message, classes, type, onClick }) => {
  type = type || 'warning'
  return (
    <div
        className={classNames(classes.base, classes[type])}
        onClick={onClick}
    >
      {message}
      <Icon
          className={classes.icon}
          color="secondary"
      >close</Icon>
    </div>
  )
}

Error.propTypes = {
  classes:  PropTypes.object.isRequired,
  message:  PropTypes.string.isRequired,
  onClick:  PropTypes.func.isRequired,
  type:     PropTypes.string,
}

const styles = theme => ({
  base: {
    borderRadius:     4,
    position: 'relative',
    margin:           theme.spacing.unit,
    marginBottom:     0,
    padding:          theme.spacing.unit * 1.2,
    paddingLeft:      theme.spacing.unit * 1.5,
    paddingRight:     theme.spacing.unit * 1.5,
    color:            grey[800],
  },
  danger: {
    // backgroundColor:  'rgba(242, 69, 61, 0.3)',
    backgroundColor:  '#FBC7C6',
  },
  success: {
    backgroundColor: 'rgba(80, 174, 84, 0.3)',
  },
  info: {
    backgroundColor: 'rgba(31, 188, 211, 0.3)',
  },
  warning: {
    backgroundColor: 'rgba(254, 234, 78, 0.3)',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 7,
  },
})

export default withStyles(styles)(Error)
