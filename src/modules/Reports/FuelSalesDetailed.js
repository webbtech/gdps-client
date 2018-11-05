import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from 'react-apollo'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import * as utils from '../../utils/utils'
import Loader from '../Common/Loader'
import ReportSelectors from './ReportSelectors'
import { FUEL_TYPE_LIST } from '../../config/constants'


const FSD_REPORT_QUERY = gql`
query FuelSaleDetailedReport($date: String!, $stationID: String!) {
  fuelSaleDetailedReport(date: $date, stationID: $stationID) {
    stationID
    fuelTypes
    weekSales {
      sales {
        date
        sales
      }
      totals
      yearWeek
    }
  }
}
`

const Report = ({ data, classes }) => {
  if (!data) return null
  if (data && data.loading) { return <div className={classes.container}><Loader /></div> }

  if (!data.fuelSaleDetailedReport) {
    return (
      <div className={classes.container}>
        <Typography
          variant="body2"
        >There is no data available for the specified date.
        </Typography>
      </div>
    )
  }

  const fts = utils.setOrderedFuelTypes(data.fuelSaleDetailedReport.fuelTypes, FUEL_TYPE_LIST)
  return (
    <div className={classes.container}>
      <Typography
        gutterBottom
        variant="h5"
      >Fuel Sales Station Detail
      </Typography>
      {data.fuelSaleDetailedReport.weekSales.map((sale, i) => (
        <Week
          classes={classes}
          data={sale}
          fuelTypes={fts}
          key={i}
        />
      ))}
    </div>
  )
}
Report.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
}

const WeekHeader = ({ wkNo, fuelTypes, classes }) => (
  <div className={classes.weekHdrRow}>
    <div className={classes.weekHdrCell}>Week {wkNo}</div>
    {fuelTypes.map(ft => (
      <div
        className={classes.weekDataRt}
        key={ft}
      >{ft}
      </div>
    ))}
  </div>
)
WeekHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  fuelTypes: PropTypes.array.isRequired,
  wkNo: PropTypes.string.isRequired,
}

const Week = ({ data, fuelTypes, classes }) => {
  const wkNo = data.yearWeek.toString().substring(4)
  return (
    <Paper className={classes.weekContainer}>
      <WeekHeader
        classes={classes}
        fuelTypes={fuelTypes}
        wkNo={wkNo}
      />
      {data.sales.map(sale => (
        <div
          className={classes.weekDataRow}
          key={sale.date}
        >
          <div className={classes.weekDataCell}>{moment(sale.date.toString()).format('MMM DD')}</div>
          {fuelTypes.map(ft => (
            <div
              className={classes.weekDataRt}
              key={ft}
            >{utils.fmtNumber(sale.sales[ft], 0, true)}
            </div>
          ))}
        </div>
      ))}
      <WeekSummary
        classes={classes}
        data={data.totals}
        fuelTypes={fuelTypes}
      />
    </Paper>
  )
}
Week.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  fuelTypes: PropTypes.array.isRequired,
}

const WeekSummary = ({ data, fuelTypes, classes }) => (
  <div className={classes.weekSummary}>
    <div className={classes.weekDataCell} >{'  '}</div>
    {fuelTypes.map(ft => (
      <div
        className={classes.weekDataRt}
        key={ft}
      >{utils.fmtNumber(data[ft], 0, true)}
      </div>
    ))}
  </div>
)
WeekSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  fuelTypes: PropTypes.array.isRequired,
}


class FuelSalesDetailed extends Component {
  render() {
    const { classes, data } = this.props

    if (data && data.error) {
      return <p>Data Error :(</p>
    }

    return (
      <div className={classes.mainContainer}>
        <ReportSelectors />
        <Report
          classes={classes}
          data={data}
        />
      </div>
    )
  }
}

FuelSalesDetailed.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.unit * 5,
    width: theme.spacing.unit * 55,
  },
  mainContainer: {
    width: 600,
    margin: 'auto',
  },
  weekContainer: {
    display: 'flex-inline',
    marginBottom: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
  },
  weekHdrRow: {
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.grey['300'],
    color: theme.palette.grey['700'],
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 400,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  weekHdrCell: {
    display: 'flex',
    flex: 1,
    textAlign: 'right',
  },
  weekDataRow: {
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
  weekDataCell: {
    flex: 1,
  },
  weekDataRt: {
    flex: 1,
    textAlign: 'right',
  },
  weekSummary: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 500,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
})

export default graphql(FSD_REPORT_QUERY, {
  skip: props => props.location.pathname.split('/').length < 5,
  options: (props) => {
    const prts = utils.extractPathParts(props.location.pathname, 3)
    return ({
      variables: {
        date: moment(prts[0]).format('YYYY-MM-DD'),
        stationID: prts[1],
      },
    })
  },
})(withStyles(styles)(FuelSalesDetailed))
