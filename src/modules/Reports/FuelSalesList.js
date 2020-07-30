import React from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from '@apollo/react-hoc'
import { Link } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Loader from '../Common/Loader'
import ReportSelectors from './ReportSelectors'
import * as utils from '../../utils/utils'


const FSL_REPORT_QUERY = gql`
query FuelSaleListReport($date: String!) {
  fuelSaleListReport(date: $date) {
    periodHeader {
      yearWeek
      startDate
      endDate
      week
    }
    periodSales {
      fuelPrices
      periods {
        dates
        fuelSales {
          NL
          DSL
        }
      }
      stationID
      stationName
      stationTotal {
        NL
        DSL
      }
    }
    periodTotals {
      period
      NL
      DSL
    }
    totalsByFuel {
      NL
      DSL
    }
  }
}
`

const Report = ({ classes, data, date }) => {
  if (!data) return null
  if (data && data.loading) { return <div className={classes.container}><Loader /></div> }

  if (!data.fuelSaleListReport) {
    return (
      <div className={classes.container}>
        <Typography>There is no data available for the specified date.</Typography>
      </div>
    )
  }

  const { periodSales } = data.fuelSaleListReport

  return (
    <div className={classes.container}>
      <Typography
        gutterBottom
        variant="h5"
      >Fuel Sales Station List
      </Typography>
      <Paper className={classes.reportContainer}>
        <Typography
          className={classes.title}
          gutterBottom
          variant="h6"
        >No-Lead Report
        </Typography>
        <PeriodHdr
          classes={classes}
          data={data.fuelSaleListReport}
        />
        {periodSales.map(sale => (
          <SalesRow
            classes={classes}
            data={sale}
            date={date}
            key={sale.stationID}
            type="NL"
          />
        ))}
        <SummaryRow
          classes={classes}
          data={data.fuelSaleListReport}
          type="NL"
        />
        <Typography>&nbsp; *NOTE: Values in brackets are fuel price average for period</Typography>
      </Paper>
      <br />
      <Paper className={classes.reportContainer}>
        <Typography
          className={classes.title}
          gutterBottom
          variant="h6"
        >Diesel Report
        </Typography>
        <PeriodHdr
          classes={classes}
          data={data.fuelSaleListReport}
        />
        {periodSales.map(sale => (
          <SalesRow
            classes={classes}
            data={sale}
            date={date}
            key={sale.stationID}
            type="DSL"
          />
        ))}
        <SummaryRow
          classes={classes}
          data={data.fuelSaleListReport}
          type="DSL"
        />
      </Paper>
    </div>
  )
}
Report.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
  date: PropTypes.string,
}
Report.defaultProps = {
  data: null,
  date: '',
}


const PeriodHdr = ({ classes, data }) => (
  <div className={classes.periodHdrRow}>
    <div
      className={classes.periodHdrCell}
      style={{ flex: 0.75 }}
    />
    {data.periodHeader.map(period => (
      <div
        className={classes.periodHdrCell}
        key={period.week}
      >
        {moment(period.startDate).format('MM/DD')} - {moment(period.endDate).format('MM/DD')}
      </div>
    ))}
    <div
      className={classes.dataCell}
      style={{ flex: 0.75 }}
    />
  </div>
)
PeriodHdr.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
}

const SalesRow = ({
  classes, data, date, type,
}) => {
  // Skip stations that don't have diesel when doing diesel report
  if (type === 'DSL' && data.stationTotal.DSL <= 0) return null
  const link = `/reports/fuel-sales-detailed/${date}/${data.stationID}`

  return (
    <div className={classes.dataRow}>
      <div className={classes.dataCellStation}>
        <Link to={link}>{data.stationName}</Link>
      </div>
      {data.periods.map(sale => (
        <div
          className={classes.dataCell}
          key={sale.dates.yearWeek}
        >
          {utils.fmtNumber(sale.fuelSales[type], 0, true)}
          {data.fuelPrices.prices[sale.dates.yearWeek] && type === 'NL' &&
            <span className={classes.fuelPrice}>
              ({utils.fmtNumber(data.fuelPrices.prices[sale.dates.yearWeek], 1)})
            </span>
          }
        </div>
      ))}
      <div
        className={classes.dataCell}
        style={{ flex: 0.75 }}
      >
        {utils.fmtNumber(data.stationTotal[type], 0, true)}
      </div>
    </div>
  )
}
SalesRow.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  date: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

const SummaryRow = ({
  classes,
  data,
  type,
}) => (
  <div className={classes.dataSummaryRow}>
    <div className={classes.dataCellStation} />
    {data.periodTotals.map(period => (
      <div
        className={classes.dataTotalCell}
        key={period.period}
      >
        {utils.fmtNumber(period[type], 0, true)}
      </div>
    ))}
    <div
      className={classes.dataTotalCell}
      style={{ flex: 0.75 }}
    >
      {utils.fmtNumber(data.totalsByFuel[type], 0, true)}
    </div>
  </div>
)
SummaryRow.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  type: PropTypes.string.isRequired,
}


const FuelSalesList = ({ classes, data, match }) => {
  const date = match.params.date // eslint-disable-line

  return (
    <div className={classes.mainContainer}>
      <ReportSelectors hideStation />
      <Report
        classes={classes}
        data={data}
        date={date}
      />
    </div>
  )
}
FuelSalesList.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
  match: PropTypes.instanceOf(Object).isRequired,
}
FuelSalesList.defaultProps = {
  data: null,
  date: null,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.unit * 3,
    width: theme.spacing.unit * 55,
  },
  mainContainer: {
    width: 900,
    margin: 'auto',
  },
  dataRow: {
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
  dataSummaryRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  dataCell: {
    flex: 1,
    textAlign: 'right',
  },
  dataTotalCell: {
    flex: 1,
    fontWeight: 550,
    textAlign: 'right',
  },
  dataCellStation: {
    flex: 0.75,
  },
  fuelPrice: {
    fontSize: 14,
    paddingLeft: theme.spacing.unit,
  },
  periodHdrRow: {
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.grey['300'],
    color: theme.palette.grey['700'],
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 400,
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  periodHdrCell: {
    flex: 1,
    textAlign: 'right',
    paddingRight: theme.spacing.unit,
  },
  reportContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    width: 900,
  },
  title: {
    paddingLeft: theme.spacing.unit * 2,
  },
})

export default graphql(FSL_REPORT_QUERY, {
  skip: ({ match }) => !match || !match.params.date,
  options: ({ match }) => ({
    variables: {
      date: match.params.date,
    },
  }),
})(withStyles(styles)(FuelSalesList))
