import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import { styles as ms } from '../../styles/main'

import PropaneForm from './PropaneForm.cont'

class Propane extends Component {
  render() {
    const { classes, history } = this.props

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>
          <Typography
            gutterBottom
            variant="h5"
          >Propane Entries
          </Typography>
          <Divider /><br />
          <PropaneForm />
        </Paper>
      </div>
    )
  }
}

Propane.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withStyles(ms)(Propane)
