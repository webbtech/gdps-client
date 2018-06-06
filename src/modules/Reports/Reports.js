import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import FuelDeliveries from './FuelDeliveries'
import FuelSalesMonthly from './FuelSalesMonthly'
import FuelSalesWeekly from './FuelSalesWeekly'
import Header from '../Header/Header'
import OverShortDaily from './OverShortDaily'
import OverShortMonthly from './OverShortMonthly'
import PropaneSalesMonthly from './PropaneSalesMonthly'
import PropaneSalesWeekly from './PropaneSalesWeekly'
import ReportMenu from './ReportMenu'
import { styles as ms } from '../../styles/main'


class Reports extends Component {

  render() {

    const { classes, match } = this.props

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Header />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Reports</Typography>
          <ReportMenu />
          <Divider /><br />
          <div>
            <Route
                component={FuelSalesWeekly}
                path={`${match.url}/fuel-sales-weekly`}
            />
            <Route
                component={FuelSalesMonthly}
                path={`${match.url}/fuel-sales-monthly`}
            />
            <Route
                component={OverShortDaily}
                path={`${match.url}/overshort-daily`}
            />
            <Route
                component={OverShortMonthly}
                path={`${match.url}/overshort-monthly`}
            />
            <Route
                component={FuelDeliveries}
                path={`${match.url}/fuel-deliveries`}
            />
            <Route
                component={PropaneSalesWeekly}
                path={`${match.url}/propane-sales-weekly`}
            />
            <Route
                component={PropaneSalesMonthly}
                path={`${match.url}/propane-sales-monthly`}
            />
          </div>
        </Paper>
      </div>
    )
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default withStyles(ms)(Reports)
