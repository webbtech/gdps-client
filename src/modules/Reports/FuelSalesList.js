import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from 'react-apollo'
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
    periodHeader
    sales {
      fuelPrices
      periods
      stationID
      stationName
      stationTotal
    }
    periodTotals
    totalsByFuel
  }
}
`

const Report = ({ classes, data, date }) => {

  if (!data) return null
  if (data && data.loading)
    return <div className={classes.container}><Loader /></div>

  if (!data.fuelSaleListReport) {
    return (
      <div className={classes.container}>
        <Typography>There is no data available for the specified date.</Typography>
      </div>
    )
  }

  const sales = data.fuelSaleListReport.sales

  return (
    <div className={classes.container}>
      <Typography
          gutterBottom
          variant="h5"
      >Fuel Sales Station List</Typography>
      <Paper className={classes.reportContainer}>
        <Typography
            className={classes.title}
            gutterBottom
            variant="h6"
        >No-Lead Report</Typography>
        <PeriodHdr
            classes={classes}
            data={data.fuelSaleListReport.periodHeader}
        />
        {sales.map((sale, i) => (
          <SalesRow
              classes={classes}
              data={sale}
              date={date}
              key={i}
              type="NL"
          />
        ))}
        <SummaryRow
            classes={classes}
            data={data.fuelSaleListReport}
            type="NL"
        />
      <Typography>*NOTE: Values in brackets are fuel price average for period</Typography>
      </Paper>
      <br />
      <Paper className={classes.reportContainer}>
        <Typography
            className={classes.title}
            gutterBottom
            variant="h6"
        >Diesel Report</Typography>
        <PeriodHdr
            classes={classes}
            data={data.fuelSaleListReport.periodHeader}
        />
        {sales.map((sale, i) => (
          <SalesRow
              classes={classes}
              data={sale}
              date={date}
              key={i}
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
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  date:     PropTypes.string,
}

const PeriodHdr = ({ classes, data }) => {

  let periods = []
  for (const period in data) periods.push(data[period])

  return (
    <div className={classes.periodHdrRow}>
      <div
          className={classes.periodHdrCell}
          style={{flex: .75}}
      />
      {periods.map((period, i) => (
        <div
            className={classes.periodHdrCell}
            key={i}
        >
          {moment(period.startDate).format('MM/DD')} - {moment(period.endDate).format('MM/DD')}
        </div>
      ))}
      <div
          className={classes.dataCell}
          style={{flex: .75}}
      />
    </div>
  )
}
PeriodHdr.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
}

const SalesRow = ({ classes, data, date, type }) => {

  // Skip stations that don't have diesel when doing diesel report
  if (type === 'DSL' &&  data.stationTotal.DSL <= 0) return null
  const sales = []
  const link = `/reports/fuel-sales-detailed/${date}/${data.stationID}`

  for (const period in data.periods) {
    sales.push({
      amount: data.periods[period].sales[type],
      fuelPrice: type === 'NL' ? data.fuelPrices.prices[period] : null,
    })
  }

  return (
    <div className={classes.dataRow}>
      <div className={classes.dataCellStation}>
        <Link to={link}>{data.stationName}</Link>
      </div>
      {sales.map((sale, i) => (
        <div
            className={classes.dataCell}
            key={i}
        >
          {utils.fmtNumber(sale.amount, 0, true)}
          {sale.fuelPrice && <span className={classes.fuelPrice}>({utils.fmtNumber(sale.fuelPrice, 1)})</span>}
        </div>
      ))}
      <div
          className={classes.dataCell}
          style={{flex: .75}}
      >
        {utils.fmtNumber(data.stationTotal[type], 0 , true)}
      </div>
    </div>
  )
}
SalesRow.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  date:     PropTypes.string.isRequired,
  type:     PropTypes.string.isRequired,
}

const SummaryRow = ({ classes, data, type }) => {

  let sums = []
  for (const sum in data.periodTotals) sums.push(data.periodTotals[sum][type])
  const total = data.totalsByFuel[type]

  return (
    <div className={classes.dataSummaryRow}>
      <div className={classes.dataCellStation} />
      {sums.map((sum, i) => (
        <div
            className={classes.dataTotalCell}
            key={i}
        >
          {utils.fmtNumber(sum, 0, true)}
        </div>
      ))}
      <div
          className={classes.dataTotalCell}
          style={{flex: .75}}
      >
        {utils.fmtNumber(total, 0, true)}
      </div>
    </div>
  )
}
SummaryRow.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  type:     PropTypes.string.isRequired,
}

class FuelSalesList extends Component {

  render() {

    let dte
    const { classes, data } = this.props
    const prts = utils.extractPathParts(this.props.location.pathname, 3)

    if (prts) {
      dte = prts[0]
    }

    return (
      <div className={classes.mainContainer}>
        <ReportSelectors
            hideStation
        />
        <Report
            classes={classes}
            data={data}
            date={dte}
        />
      </div>
    )
  }
}

FuelSalesList.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    marginTop:      theme.spacing.unit * 3,
    width:          theme.spacing.unit * 55,
  },
  mainContainer: {
    width:  900,
    margin: 'auto',
  },
  dataRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    display:            'flex',
    flexDirection:      'row',
    paddingBottom:      theme.spacing.unit,
    paddingTop:         theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.grey['100'],
    },
  },
  dataSummaryRow: {
    display:            'flex',
    flexDirection:      'row',
    paddingBottom:      theme.spacing.unit,
    paddingTop:         theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
  },
  dataCell: {
    flex:       1,
    textAlign:  'right',
  },
  dataTotalCell: {
    flex:       1,
    fontWeight: 550,
    textAlign:  'right',
  },
  dataCellStation: {
    flex:     .75,
  },
  fuelPrice: {
    fontSize:     14,
    paddingLeft:  theme.spacing.unit,
  },
  periodHdrRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    color:              theme.palette.grey['700'],
    display:            'flex',
    flexDirection:      'row',
    fontWeight:         400,
    paddingBottom:      theme.spacing.unit,
    paddingTop:         theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
  },
  periodHdrCell: {
    flex:         1,
    textAlign:    'right',
    paddingRight: theme.spacing.unit,
  },
  reportContainer: {
    display:        'flex',
    flexDirection:  'column',
    marginBottom:   theme.spacing.unit * 2,
    paddingBottom:  theme.spacing.unit * 2,
    paddingTop:     theme.spacing.unit * 2,
    width:          900,
  },
  title: {
    paddingLeft:        theme.spacing.unit * 2,
  },
})

export default graphql(FSL_REPORT_QUERY, {
  skip: props => props.location.pathname.split('/').length < 4,
  options: (props) => {
    const prts = utils.extractPathParts(props.location.pathname, 3)
    return ({
      variables: {
        date: prts[0],
      },
    })
  },
})(withStyles(styles)(FuelSalesList))
