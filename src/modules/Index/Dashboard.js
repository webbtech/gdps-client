import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import { styles as ms } from '../../styles/main'


class Dashboard extends Component {

  render() {

    console.log('props in Header render: ', this.props)

    const { classes, history } = this.props
    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >
            Select Activity
          </Typography>
          <Button
              component={Link}
              to="/dips"
          >
            Dip Entries
          </Button>
          <Button
              component={Link}
              to="/propane"
          >
            Propane Entries
          </Button>
          <Button
              component={Link}
              to="/reports"
          >
            Reports
          </Button>
          <Divider light /><br />
        </Paper>
      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withStyles(ms)(Dashboard)
