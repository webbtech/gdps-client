import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import grey from '@material-ui/core/colors/grey'
import Icon from '@material-ui/core/Icon'
import red from '@material-ui/core/colors/red'
import { withStyles } from '@material-ui/core/styles'


const Error = ({
  message, classes, type, onClick,
}) => {
  const thisType = type || 'warning'
  return (
    <div
      className={classNames(classes.base, classes[thisType])}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
    >
      {message}
      <Icon
        className={classes.icon}
        color="secondary"
      >close
      </Icon>
    </div>
  )
}

Error.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
}
Error.defaultProps = {
  type: null,
}

const styles = theme => ({
  base: {
    borderRadius: 4,
    position: 'relative',
    margin: theme.spacing.unit,
    marginBottom: 0,
    padding: theme.spacing.unit * 1.2,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    color: grey[800],
  },
  danger: {
    backgroundColor: red[100],
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
