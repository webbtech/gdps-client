import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

    const { history, match } = this.props

    return (
      <div>
        <Typography
            gutterBottom
            variant="subheading"
        >Monthly Fuel Sales</Typography>
        <ReportSelectors
            hideStation
            history={history}
            match={match}
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
