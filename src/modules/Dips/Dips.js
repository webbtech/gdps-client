import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import DipSelectors from './DipSelectors'
import DipForm from './DipForm'
import { styles as ms } from '../../styles/main'

import DipOverShort from './DipOverShort'

class Dips extends Component {

  renderForm = () => {
    const { pathname } = this.props.location
    const date = pathname.split('/')[2]
    const stationID = pathname.split('/')[3]

    if (!date || ! stationID) return
    return <DipForm />
  }

  render() {

    const { classes, history } = this.props

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Dip Entries</Typography>
          <Divider /><br />
          <DipSelectors />
          <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
            <div style={{flex: 1}}>
              {this.renderForm()}
            </div>
            <div style={{flex: 1}}>
              <DipOverShort />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

Dips.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

export default withStyles(ms)(Dips)
