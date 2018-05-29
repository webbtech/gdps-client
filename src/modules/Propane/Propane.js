import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import PropaneSelectors from './PropaneSelectors'
import { styles as ms } from '../../styles/main'

import PropaneForm from './PropaneForm'

class Propane extends Component {

  render() {

    const { classes, history, location, match } = this.props

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Propane Entries</Typography>
          <Divider /><br />
          <PropaneSelectors
              history={history}
              location={location}
              match={match}
          />
          <div style={{marginTop: 20}}>
            <PropaneForm location={location} />
          </div>
        </Paper>
      </div>
    )
  }
}

Propane.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

export default withStyles(ms)(Propane)