import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import ReportSelectors from './ReportSelectors'
import { styles as ms } from '../../styles/main'

class FuelSalesMonthly extends Component {

  renderReport() {
    const { pathname } = this.props.location
    const date = pathname.split('/')[3]

    if (!date) return

    return (
      <div>
        <Typography variant="body1">date: {date}</Typography>
      </div>
    )
  }

  render() {

    const dte = '2018-06-01'
    const wk = moment(dte).week()
    console.log('wk: ', wk)
    const wkDte = moment().week(wk)
    console.log('moment.week: ', wkDte.day(0).format('YYYY-MM-DD'))

    return (
      <div>
        <Typography
            gutterBottom
            variant="subheading"
        >Monthly Fuel Sales</Typography>
        <ReportSelectors
            hideStation
        />
        {this.renderReport()}
      </div>
    )
  }
}

FuelSalesMonthly.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

export default withStyles(ms)(FuelSalesMonthly)
