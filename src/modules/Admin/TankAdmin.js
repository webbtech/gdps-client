import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


class TankAdmin extends Component {

  render() {

    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Tank Administration</Typography>
      </div>
    )
  }
}
TankAdmin.propTypes = {
  classes:  PropTypes.object.isRequired,
  // history:  PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // match:    PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          700,
  },
})

export default withStyles(styles)(TankAdmin)