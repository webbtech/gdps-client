import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import { styles as ms } from '../../styles/main'

class Admin extends Component {

  render() {

    const { classes, history } = this.props

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Admin</Typography>
          <Typography variant="body1" gutterBottom>
            To get started, edit something and reload.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Body 1
          </Typography>
        </Paper>
      </div>
    )
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withStyles(ms)(Admin)