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


const FD_REPORT_QUERY = gql`
query FuelDeliveryReport($date: String!, $stationID: String!) {
  fuelDeliveryReport(date: $date, stationID: $stationID) {
    fuelTypes
    deliveries {
      data
      date
    }
    deliverySummary
  }
}
`

const Report = ({ classes, data }) => {

  if (!data) return null
  if (data && data.loading) {
    return <div className={classes.container}><Loader /></div>
  }

  if (!data.fuelDeliveryReport) {
    return (
      <div className={classes.container}>
        <Typography>There is no data available for the specified date.</Typography>
      </div>
    )
  }

  const fts = utils.setOrderedFuelTypes(data.fuelDeliveryReport.fuelTypes, FUEL_TYPE_LIST)

  return (
    <div className={classes.container}>
      <Paper className={classes.reportContainer}>
        <Typography
            className={classes.title}
            gutterBottom
            variant="h6"
        >Fuel Deliveries</Typography>
        <br />
        <ReportHeading
            classes={classes}
            data={fts}
        />
        <ReportData
            classes={classes}
            data={data.fuelDeliveryReport.deliveries}
            fuelTypes={fts}
        />
        <ReportSummary
            classes={classes}
            data={data.fuelDeliveryReport.deliverySummary}
            fuelTypes={fts}
        />
      </Paper>
    </div>
  )
}
Report.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
}

const ReportHeading = ({ classes, data }) => (
  <div className={classes.headerRow}>
    <div className={classes.headerCell}>Day</div>
    {data.map(ft => (
      <div
          className={classes.headerCellRt}
          key={ft}
      >{ft}</div>
    ))}
  </div>
)
ReportHeading.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.array.isRequired,
}

const ReportData = ({ classes, data, fuelTypes }) => (
  data.map(d => (
    <div
        className={classes.reportDataRow}
        key={d.date}
    >
      <div className={classes.reportDataDateCell}>
        {moment(d.date.toString()).format('MMM D')}
      </div>
      {fuelTypes.map(ft => (
        <div
            className={classes.reportDataCell}
            key={ft}
        >
          {utils.fmtNumber(d.data[ft], 0, true)}
        </div>
      ))}
    </div>
  ))
)
ReportData.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.array.isRequired,
}

const ReportSummary = ({ classes, data, fuelTypes }) => (
  <div className={classes.reportSummaryRow}>
    <div className={classes.reportDataDateCell} />
    {fuelTypes.map(ft => (
      <div
          className={classes.reportSummaryCell}
          key={ft}
      >
        {utils.fmtNumber(data[ft], 0, true)}
      </div>
    ))}
  </div>
)
ReportSummary.propTypes = {
  classes:    PropTypes.object.isRequired,
  data:       PropTypes.object.isRequired,
  fuelTypes:  PropTypes.array.isRequired,
}


class FuelDeliveries extends Component {

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
FuelDeliveries.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  location: PropTypes.object,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    marginTop:      theme.spacing.unit * 3,
  },
  headerRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    color:              theme.palette.grey['700'],
    display:            'flex',
    flexDirection:      'row',
    paddingBottom:      theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
  },
  headerCell: {
    width: 80,
  },
  headerCellRt: {
    textAlign:  'right',
    width: 120,
  },
  mainContainer: {
    width:  600,
    margin: 'auto',
  },
  reportContainer: {
    flexDirection:  'column',
    marginBottom:   theme.spacing.unit * 2,
     paddingBottom: theme.spacing.unit * 2,
    paddingTop:     theme.spacing.unit * 2,
  },
  reportDataRow: {
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
  reportDataCell: {
    textAlign:  'right',
    width: 120,
  },
  reportDataNeg: {
    color: theme.palette.primary.main,
  },
  reportDataDateCell: {
    width: 80,
  },
  reportSummaryCell: {
    textAlign:  'right',
    fontWeight: 500,
    width: 120,
  },
  reportSummaryRow: {
    display:            'flex',
    flexDirection:      'row',
    paddingBottom:      theme.spacing.unit,
    paddingTop:         theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
  },
  title: {
    paddingLeft:        theme.spacing.unit * 2,
  },
})

// export default withStyles(ms)(FuelDeliveries)
export default graphql(FD_REPORT_QUERY, {
  skip: props => props.location.pathname.split('/').length < 5,
  options: (props) => {
    const prts = utils.extractPathParts(props.location.pathname, 3)
    return ({
      variables: {
        date:       moment(prts[0]).format('YYYY-MM-DD'),
        stationID:  prts[1],
      },
    })
  },
})(withStyles(styles)(FuelDeliveries))
