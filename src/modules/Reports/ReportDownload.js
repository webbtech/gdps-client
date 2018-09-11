import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Save from '@material-ui/icons/Save'

import StationSelector from '../Common/StationSelector'
import Toaster from '../Common/Toaster'
import { RECORDS_START_YEAR as startYear } from '../../config/constants'

// note: This might need to go into an init file
Array.range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start)

const DOWNLOAD_REPORT = gql`
mutation FuelSaleDownload($date: String!, $stationID: String!) {
  fuelSaleDownload(date: $date, stationID: $stationID) {
    date
    reportLink
    stationID
  }
}
`

class ReportDownload extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      month: moment(new Date()).subtract(1, 'months').format('MM'),
      stationID: '',
      toasterMsg: '',
      year: (new Date()).getFullYear(),
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

   setMonths = () => {
    let months = []
    for (let i=0; i < 12; i++) {
      const dte = moment(new Date(0, i))
      months.push({key: dte.format('MM'), label: dte.format('MMMM')})
    }
    return months
  }

  setYears = () => {
    const curYear = (new Date()).getFullYear()
    const years = Array.range(startYear, curYear)
    return years.reverse()
  }

  handleChange = event => {
    this.setState(() => ({ [event.target.name]: event.target.value , toasterMsg: ''}))
  }

  handleStationChange = value => {
    this.setState(() => ({ stationID: value, toasterMsg: '' }))
  }

  // handleSubmit = async () => {
  handleSubmit = () => {

    if (!this.state.stationID) {
      this.setState(() => ({toasterMsg: 'Missing Station'}))
      return
    }
    const yr = this.state.year.toString()
    const date = `${yr}-${this.state.month}-01`
    const m = moment(date)
    if (!m.isValid()) {
      this.setState(() => ({toasterMsg: 'Invalid date'}))
      return
    }
    const today = moment().startOf('month')
    if (today.isBefore(date)) {
      this.setState(() => ({toasterMsg: 'Invalid date. Select an earlier date.'}))
      return
    }
    const { stationID } = this.state
    const variables = {
      date,
      stationID,
    }
    const tabOpen = window.open(`${window.location.origin}/download`, '_new')
    // let tabOpen = window.open("localhost:blank", 'ReportDownload')

    this.props.mutate({
      variables,
    })
    .then(({ data }) => {
      tabOpen.location = data.fuelSaleDownload.reportLink
    }).catch((error) => {
      const errMsg = `There was an error sending the query: ${error}`
      console.error('error: ', errMsg) // eslint-disable-line
      // this.props.actions.errorSend({message: errMsg, type: 'danger'})
    })
  }

  render() {

    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Typography
            className={classes.title}
            gutterBottom
            variant="title"
        >Report Download</Typography>
        <div className={classes.selectRow}>

          <div className={classes.selectCell}>
            <FormControl className={classes.formControl}>
              <StationSelector
                  onStationChange={this.handleStationChange}
                  stationID={this.state.stationID}
              />
            </FormControl>
          </div>

          <div className={classes.selectCell}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="year-select">Year</InputLabel>
              <Select
                  inputProps={{
                    name: 'year',
                    id: 'year-select',
                  }}
                  onChange={this.handleChange}
                  value={this.state.year}
              >
                {this.setYears().map(yr => (
                  <MenuItem
                      key={yr}
                      value={yr}
                  >{yr}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.selectCell}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="month-select">Month</InputLabel>
              <Select
                  inputProps={{
                    name: 'month',
                    id: 'month-select',
                  }}
                  onChange={this.handleChange}
                  value={this.state.month}
              >
                {this.setMonths().map(m => (
                  <MenuItem
                      key={m.key}
                      value={m.key}
                  >{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.buttonCell}>
            <Button
                color="primary"
                onClick={() => this.handleSubmit()}
                variant="raised"
            >
            <Save className={classes.leftIcon} />
            Download Report
            </Button>
          </div>

        </div>
        <div className={classes.reportDetails}>
          This report file download is a "xlsx" spreadsheet file and consists of the following station details:
          <ul>
            <li>Fuel Sales</li>
            <li>Fuel Deliveries</li>
            <li>Over-Short Monthly</li>
            <li>Over-Short Annual</li>
          </ul>
        </div>
        <Toaster message={this.state.toasterMsg} />
      </div>
    )
  }
}
ReportDownload.propTypes = {
  classes:  PropTypes.object.isRequired,
  mutate:   PropTypes.func.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          600,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  reportDetails: {
    color: theme.palette.grey['700'],
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: theme.spacing.unit * 4,
    width: 400,
    '& li': {
      marginBottom: 6,
    },
  },
  selectCell: {
    flexGrow: 1,
  },
  selectRow: {
    display:        'inline-flex',
    flexDirection:  'row',
  },
})

const styledForm = withStyles(styles)(ReportDownload)

export default graphql(DOWNLOAD_REPORT, {
  skip: true,
})(styledForm)
