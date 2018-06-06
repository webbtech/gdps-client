import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import AdminSelectors from './AdminSelectors'
import StationInfo from './StationInfo'
import { styles as ms } from '../../styles/main'


class Admin extends Component {

  render() {

    const { classes } = this.props

    return (
      <div>
        <Header />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Station Administration</Typography>
          <AdminSelectors />
          <StationInfo />
        </Paper>
      </div>
    )
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(ms)(Admin)