import React from 'react'
import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const Loader = ({ classes }) => (
  <div className={classes.container}>
    <CircularProgress className={classes.progress} />
  </div>
)

Loader.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
}

const styles = theme => ({
  container: {
    position: 'relative',
    // left: theme.spacing.unit * 10,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(Loader)
