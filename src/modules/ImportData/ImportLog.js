import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { Query } from '@apollo/react-components'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { ucFirst } from '../../utils/utils'

import Loader from '../Common/Loader'

const IMPORT_LOG = gql`
query ImportLog($importType: String!) {
  importLog (importType: $importType) {
    dateStart,
    dateEnd,
    importDate,
    importType,
    recordQty
  }
}
`

const Report = ({ classes, importType }) => (

  <Query
    query={IMPORT_LOG}
    variables={{ importType }}
  >
    {({
 loading, error, data, refetch,
}) => {
      // console.log('importType: ', importType)
      if (error) return `Error!: ${error}`
      if (loading) { return <div className={classes.container}><Loader /></div> }

      return (
        <div className={classes.reportContainer}>
          <ReportHeading
            classes={classes}
            importType={importType}
          />
          {data.importLog.map((d, i) => (
            <div
              className={classes.reportDataRow}
              key={i}
            >
              <div className={classes.reportDataCell}>{d.importDate}</div>
              <div className={classes.reportDataCell}>{d.dateStart} ... {d.dateEnd}</div>
              <div className={classes.reportDataCell}>{d.recordQty}</div>
            </div>
          ))}
        </div>
      )
    }}
  </Query>
)
Report.propTypes = {
  classes: PropTypes.object.isRequired,
}

const ReportHeading = ({ classes }) => (
  <div className={classes.headerRow}>
    <div
      className={classes.headerCell}
      style={{ flex: 1.5 }}
    >Import Date
    </div>
    <div
      className={classes.headerCell}
      style={{ flex: 2.45 }}
    >Date Range
    </div>
    <div className={classes.headerCell}>Record Qty</div>
  </div>
)
ReportHeading.propTypes = {
  classes: PropTypes.object.isRequired,
}


class ImportLog extends Component {
  render() {
    const { classes, importType } = this.props
    // console.log('importType: ', importType)

    return (
      <Paper className={classes.container}>
        <Typography
          className={classes.title}
          gutterBottom
          variant="h6"
        >
          Import Log ({ucFirst(importType)})
        </Typography>
        <Report
          classes={classes}
          importType={importType}
        />
      </Paper>
    )
  }
}
ImportLog.propTypes = {
  classes: PropTypes.object.isRequired,
  importType: PropTypes.string.isRequired,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.unit * 2,
    width: 500,
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
    flex: 1,
  },
  headerCellRt: {
    textAlign: 'right',
    flex: 1,
  },
  reportContainer: {

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
    flexGrow: 1,
  },
  title: {
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(ImportLog)
