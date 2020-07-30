import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from '@apollo/react-hoc'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import * as utils from '../../utils/utils'
import Loader from '../Common/Loader'
import ReportSelectors from './ReportSelectors'


const PSA_REPORT_QUERY = gql`
query PropaneSaleAnnualReport($date: String!) {
  propaneSaleAnnualReport(date: $date) {
    deliveries
    deliveryTotal
    sales
    salesSummary
  }
}
`

const Report = ({ classes, data }) => {
  if (!data) return null
  if (data && data.loading) {
    return <div className={classes.container}><Loader /></div>
  }

  if (!data.propaneSaleAnnualReport) {
    return (
      <div className={classes.container}>
        <Typography
          variant="body2"
        >There is no data available for the specified date.
        </Typography>
      </div>
    )
  }

  const reportData = data.propaneSaleAnnualReport
  // console.log('reportData: ', reportData)

  return (
    <div className={classes.container}>
      <Paper className={classes.reportContainer}>
        <div className={classes.reportTitleContainer}>
          <Typography
            gutterBottom
            variant="h6"
          >Propane Annual Sales
          </Typography>
          <br />
        </div>
        <ReportHeading classes={classes} />
        <ReportData
          classes={classes}
          data={reportData}
        />
      </Paper>
    </div>
  )
}
Report.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
}

const ReportHeading = ({ classes }) => (
  <div className={classes.headerRow}>
    <div className={classes.headerCell}>Date</div>
    <div className={classes.headerCellRt}>Auto Fuel</div>
    <div className={classes.headerCellRt}>Tank Fuel</div>
    <div className={classes.headerCellRt}>Deliveries</div>
  </div>
)
ReportHeading.propTypes = {
  classes: PropTypes.object.isRequired,
}

const ReportData = ({ classes, data }) => {
  // console.log('data in ReportData: ', data)
  const rows = []

  for (const dte in data.sales) {
    rows.push(<div
      className={classes.reportDataRow}
      key={dte}
    >
      <div className={classes.reportDateCell}>
        {moment(`${dte.toString()}01`).format('MMM')}
      </div>
      <div className={classes.reportDataCell}>{utils.fmtNumber(data.sales[dte]['475'], 0, true)}</div>
      <div className={classes.reportDataCell}>{utils.fmtNumber(data.sales[dte]['476'], 0, true)}</div>
      <div className={classes.reportDataCell}>{utils.fmtNumber(data.deliveries[dte], 0, true)}</div>
    </div>)
  }

  return (
    <div>
      {rows}
      <div className={classes.reportSummaryRow}>
        <div className={classes.reportDateCell} />
        <div className={classes.reportSummaryCell}>{utils.fmtNumber(data.salesSummary['475'], 0, true)}</div>
        <div className={classes.reportSummaryCell}>{utils.fmtNumber(data.salesSummary['476'], 0, true)}</div>
        <div className={classes.reportSummaryCell}>{utils.fmtNumber(data.deliveryTotal, 0, true)}</div>
      </div>
    </div>
  )
}
ReportData.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}


class PropaneSalesAnnual extends Component {
  render() {
    const { classes, data } = this.props
    // console.log('data: ', data)

    if (data && data.error) {
      return <p>Data Error :(</p>
    }

    return (
      <div className={classes.mainContainer}>
        <ReportSelectors
          hideMonth
          hideStation
        />
        <Report
          classes={classes}
          data={data}
        />
      </div>
    )
  }
}
PropaneSalesAnnual.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  location: PropTypes.object.isRequired,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.unit * 3,
  },
  headerRow: {
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.grey['300'],
    color: theme.palette.grey['700'],
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  headerCell: {
    flex: 0.25,
  },
  headerCellRt: {
    flex: 1,
    textAlign: 'right',
  },
  mainContainer: {
    width: 450,
    margin: 'auto',
  },
  reportContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginBottom: theme.spacing.unit * 2,
  },
  reportDataRow: {
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.grey['300'],
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.grey['100'],
    },
  },
  reportDataCell: {
    flex: 1,
    textAlign: 'right',
  },
  reportDateCell: {
    flex: 0.25,
  },
  reportMargin: {
    width: theme.spacing.unit * 10,
  },
  reportSummaryCell: {
    flex: 1,
    fontWeight: 500,
    textAlign: 'right',
  },
  reportSummaryRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  reportTitleContainer: {
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
})

// export default withStyles(styles)(PropaneSalesAnnual)
export default graphql(PSA_REPORT_QUERY, {
  skip: props => props.location.pathname.split('/').length < 4,
  options: (props) => {
    const prts = utils.extractPathParts(props.location.pathname, 3)
    return ({
      variables: {
        date: moment(`${prts[0]}-01-01`),
      },
    })
  },
})(withStyles(styles)(PropaneSalesAnnual))
