import React from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from 'react-apollo'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import * as utils from '../../utils/utils'
import { numberToMoment } from '../../utils/date'
import Loader from '../Common/Loader'
import ReportSelectors from './ReportSelectors'


const PSM_REPORT_QUERY = gql`
query PropaneSaleMonthReport($date: String!) {
  propaneSaleMonthReport(date: $date) {
    periodSales {
      dates {
        dateStart
        dateEnd
        dayRange
        yearWeek
      }
      sales
      summary
    }
    deliveries {
      date
      litres
    }
  }
}
`

const Report = ({ classes, data }) => {
  if (!data) return null
  if (data && data.loading) {
    return <div className={classes.container}><Loader /></div>
  }

  if (!data.propaneSaleMonthReport) {
    return (
      <div className={classes.container}>
        <Typography
          variant="body2"
        >There is no data available for the specified date.
        </Typography>
      </div>
    )
  }

  // const wks = []
  const {
    deliveries,
    periodSales,
  } = data.propaneSaleMonthReport

  /*periodOrder.forEach((po) => {
    wks.push({
      week: po,
      sales: sales[po],
      summary: salesSummary[po],
    })
  })*/

  return (
    <div className={classes.container}>
      <Paper className={classes.reportContainer}>
        <div className={classes.reportTitleContainer}>
          <Typography
            gutterBottom
            variant="h6"
          >Propane Monthly Sales Detail
          </Typography>
          <br />
          <ReportHeading classes={classes} />
        </div>
        {periodSales.map(sale => (
          <ReportWeek
            classes={classes}
            data={sale}
            // key={wk.week}
          />
        ))}
      </Paper>
      <div className={classes.reportMargin} />

      <Paper className={classes.reportContainer}>
        <div className={classes.reportTitleContainer}>
          <Typography
            gutterBottom
            variant="h6"
          >Propane Deliveries
          </Typography>
        </div>
        <ReportDeliveries
          classes={classes}
          data={deliveries}
        />
      </Paper>
    </div>
  )
}
Report.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
}
Report.defaultProps = {
  data: null,
}

const ReportWeek = ({ classes, data }) => {
  const { dates, sales, summary } = data

  return (
    <div className={classes.weekContainer}>
      <div className={classes.weekHeadingRow}>
        <div className={classes.reportDateCell}>Week {dates.yearWeek.toString().substring(4)}</div>
      </div>
      {sales.map(sale => (
        <div
          className={classes.reportDataRow}
          key={sale.date}
        >
          <div className={classes.reportDateCell}>{numberToMoment(sale.date).format('MMM D')}</div>
          <div className={classes.reportDataCell}>{utils.fmtNumber(sale['475'], 0, true)}</div>
          <div className={classes.reportDataCell}>{utils.fmtNumber(sale['476'], 0, true)}</div>
        </div>
      ))}
      <div className={classes.reportSummaryRow}>
        <div className={classes.reportDateCell} />
        <div className={classes.reportSummaryCell}>{utils.fmtNumber(summary['475'], 0, true)}</div>
        <div className={classes.reportSummaryCell}>{utils.fmtNumber(summary['476'], 0, true)}</div>
      </div>
    </div>
  )
}
ReportWeek.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
}

const ReportHeading = ({ classes }) => (
  <div className={classes.headerRow}>
    <div className={classes.headerCell}>Date</div>
    <div className={classes.headerCellRt}>Auto Fuel</div>
    <div className={classes.headerCellRt}>Tank Fuel</div>
  </div>
)
ReportHeading.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
}

const ReportDeliveries = ({ classes, data }) => (
  <div className={classes.reportContainer}>
    <div className={classes.reportTitleContainer}>
      <div className={classes.headerRow}>
        <div className={classes.headerCell}>Date</div>
        <div className={classes.headerCellRt}>Fuel</div>
      </div>
      <br />
    </div>
    {data.map(del => (
      <div
        className={classes.reportDataRow}
        key={del.date}
      >
        <div className={classes.reportDateCell}>{moment(del.date.toString()).format('MMM D')}</div>
        <div className={classes.reportDataCell}>{utils.fmtNumber(del.litres, 0, true)}</div>
      </div>
    ))}
  </div>
)
ReportDeliveries.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
}


const PropaneSalesMonthly = ({ classes, data }) => {
  if (data && data.error) {
    return <p>Data Error :(</p>
  }

  return (
    <div className={classes.mainContainer}>
      <ReportSelectors
        hideStation
      />
      <Report
        classes={classes}
        data={data}
      />
    </div>
  )
}
PropaneSalesMonthly.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
  // location: PropTypes.instanceOf(Object).isRequired,
}
PropaneSalesMonthly.defaultProps = {
  data: null,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.unit * 3,
  },
  headerRow: {
    color: theme.palette.grey['700'],
    display: 'flex',
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
  },
  headerCellRt: {
    flex: 1,
    textAlign: 'right',
  },
  mainContainer: {
    width: 600,
    margin: 'auto',
  },
  reportContainer: {
    display: 'inline-flex',
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
    flex: 1,
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
    paddingRight: theme.spacing.unit * 2,
  },
  reportTitleContainer: {
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
  weekContainer: {
    flexDirection: 'column',
    marginTop: theme.spacing.unit * 2,
  },
  weekHeadingRow: {
    backgroundColor: theme.palette.grey['100'],
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
  },
})


export default graphql(PSM_REPORT_QUERY, {
  skip: props => props.location.pathname.split('/').length < 4,
  options: (props) => {
    const prts = utils.extractPathParts(props.location.pathname, 3)
    return ({
      variables: {
        date: prts[0],
      },
    })
  },
})(withStyles(styles)(PropaneSalesMonthly))

