import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
// import red from '@material-ui/core/colors/red'
import grey from '@material-ui/core/colors/grey'


const Alert = ({ children, classes, type }) =>
  // console.log('children: ', children)
  (
    <div className={classNames(classes.base, classes[type])}>{children}</div>
  )


Alert.propTypes = {
  children: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

const styles = theme => ({
  base: {
    // borderRadius:     4,
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 1.2,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    color: grey[800],
  },
  danger: {
    backgroundColor: 'rgba(242, 69, 61, 0.3)',
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
})

export default withStyles(styles)(Alert)
