import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import ReportSelectors from './ReportSelectors'
import { styles as ms } from '../../styles/main'

class OverShortMonthly extends Component {

  renderReport(pathname) {
    const date = pathname.split('/')[3]
    const storeID = pathname.split('/')[4]

    if (!date || ! storeID) return

    return (
      <div>
        <Typography variant="body1">date: {date}</Typography>
        <Typography variant="body1">storeID: {storeID}</Typography>
      </div>
    )
  }

  render() {

    const { history, match } = this.props
    const { pathname } = this.props.location

    return (
      <div>
        <Typography
            gutterBottom
            variant="subheading"
        >Monthly Overshort</Typography>
        <ReportSelectors
            hideMonth
            history={history}
            match={match}
        />
        {this.renderReport(pathname)}
      </div>
    )
  }
}

OverShortMonthly.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

export default withStyles(ms)(OverShortMonthly)
