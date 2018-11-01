import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import FuelDeliveries from './FuelDeliveries'
import FuelSalesList from './FuelSalesList'
import FuelSalesDetailed from './FuelSalesDetailed'
import Header from '../Header/Header'
import OverShortMonthly from './OverShortMonthly.cntr'
import OverShortAnnually from './OverShortAnnually.cntr'
import PropaneSalesMonthly from './PropaneSalesMonthly'
import PropaneSalesAnnual from './PropaneSalesAnnual'
import ReportMenu from './ReportMenu'
import StationReportDownload from './StationReportDownload'
import PropaneReportDownload from './PropaneReportDownload'
import FuelSalesSummaryDownload from './FuelSalesSummaryDownload'

import { styles as ms } from '../../styles/main'


class Reports extends Component {
  render() {
    const { classes, match } = this.props

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Paper className={classes.paper}>
          <Typography
            gutterBottom
            variant="h5"
          >Reports
          </Typography>
          <ReportMenu />
          <Divider /><br />
          <div>
            <Route
              component={FuelSalesDetailed}
              path={`${match.url}/fuel-sales-detailed`}
            />
            <Route
              component={FuelSalesList}
              path={`${match.url}/fuel-sales-list`}
            />
            <Route
              component={OverShortMonthly}
              exact
              path={`${match.url}/overshort-monthly`}
            />
            <Route
              component={OverShortMonthly}
              path={`${match.url}/overshort-monthly/:date/:stationID`}
            />
            <Route
              component={OverShortAnnually}
              exact
              path={`${match.url}/overshort-annually`}
            />
            <Route
              component={OverShortAnnually}
              path={`${match.url}/overshort-annually/:year/:stationID`}
            />
            <Route
              component={FuelDeliveries}
              path={`${match.url}/fuel-deliveries`}
            />
            <Route
              component={PropaneSalesAnnual}
              path={`${match.url}/propane-sales-annual`}
            />
            <Route
              component={PropaneSalesMonthly}
              path={`${match.url}/propane-sales-monthly`}
            />
            <Route
              component={StationReportDownload}
              path={`${match.url}/report-download-station`}
            />
            <Route
              component={PropaneReportDownload}
              path={`${match.url}/report-download-propane`}
            />
            <Route
              component={FuelSalesSummaryDownload}
              path={`${match.url}/report-download-fuelsalesum`}
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
