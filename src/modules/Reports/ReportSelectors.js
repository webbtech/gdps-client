import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import Create from '@material-ui/icons/Create'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

import StationSelector from '../Common/StationSelector'
import { extractPathParts } from '../../utils/utils'
import { RECORDS_START_YEAR as startYear } from '../../config/constants'

// note: This might need to go into an init file
Array.range = (start, end) => Array.from({ length: (end + 1 - start) }, (v, k) => k + start)


class Reports extends Component {
  state = {
    month: moment(new Date()).format('MM'),
    openSnackbar: false,
    selectedDate: moment(),
    snackbarMessage: '',
    stationID: '',
    year: (new Date()).getFullYear(),
  }

  componentDidMount = () => {
    const pathPrts = extractPathParts(this.props.location.pathname, 3)
    if (!pathPrts) return

    const date = pathPrts[0]
    const stationID = pathPrts[1]
    if (date) {
      let setDate
      if (date.length === 4) {
        setDate = moment().year(date)
      } else {
        setDate = moment(date)
      }
      const newDte = {
        year: setDate.format('YYYY'),
        month: setDate.subtract(1, 'months').format('MM'),
        date: setDate.format('DD'),
      }
      this.setState({ selectedDate: this.state.selectedDate.set(newDte) })
      this.setState({ month: this.state.selectedDate.format('MM') })
      this.setState({ year: parseInt(this.state.selectedDate.format('YYYY'), 10) })
    }
    if (stationID) {
      this.setState({ stationID })
    }
  }

  handleChange = (event) => {
    this.setState(() => ({ [event.target.name]: event.target.value }))
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ openSnackbar: false })
  }

  handleOpenSnackbar = (message) => {
    this.setState({ openSnackbar: true, snackbarMessage: message })
  }

  handleStationChange = (value) => {
    this.setState({ stationID: value })
  }

  // todo: replace this with the Common/Toaster component
  renderSnackBar = () => {
    const { classes } = this.props
    return (
      <Snackbar
        ContentProps={{
            'aria-describedby': 'message-id',
          }}
        action={[
          <IconButton
            aria-label="Close"
            className={classes.close}
            color="inherit"
            key="close"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
          ]}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        autoHideDuration={6000}
        message={<span id="message-id">{this.state.snackbarMessage}</span>}
        onClose={this.handleClose}
        open={this.state.openSnackbar}
      />
    )
  }

  setMonths = () => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const dte = moment(new Date(0, i))
      months.push({ key: dte.format('MM'), label: dte.format('MMMM') })
    }
    return months
  }

  setYears = () => {
    const curYear = (new Date()).getFullYear()
    const years = Array.range(startYear, curYear)
    return years.reverse()
  }

  submitReport = () => {
    const { hideMonth, hideStation, history } = this.props
    const { month, stationID, year } = this.state
    const validProps = hideStation ? month && year : month && stationID && year
    if (validProps) {
      const dte = hideMonth ? String(year) : `${year}-${month}-01`
      const reportPath = `/reports/${extractPathParts(this.props.location.pathname)[0]}`
      const uri = hideStation ? `${reportPath}/${dte}` : `${reportPath}/${dte}/${stationID}`
      history.push(uri)
    } else {
      this.handleOpenSnackbar('Missing Station. Please enter a station.')
    }
  }

  render() {
    const { classes, hideMonth, hideStation } = this.props
    this.setYears()

    return (
      <div className={classes.container}>
        <div className={classes.selectRow}>
          {!hideStation &&
          <div className={classes.cell}>
            <FormControl className={classes.formControl}>
              <StationSelector
                onStationChange={this.handleStationChange}
                stationID={this.state.stationID}
              />
            </FormControl>
          </div>
          }

          <div className={classes.cell}>
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
                  >{yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {!hideMonth &&
          <div className={classes.cell}>
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
                  >{m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          }

          <div className={classes.buttonCell}>
            <Button
              color="primary"
              onClick={this.submitReport}
              variant="contained"
            >Create Report
              <Create className={classes.rightIcon} />
            </Button>
          </div>

        </div>
        <Divider light />
        {this.renderSnackBar()}
      </div>
    )
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired,
  hideMonth: PropTypes.bool,
  hideStation: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const styles = theme => ({
  buttonCell: {
    flex: 1,
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },
  cell: {
    flex: 'flex-grow',
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  container: {
    marginBottom: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  selectRow: {
    display: 'inline-flex',
    flexDirection: 'row',
    marginBottom: theme.spacing.unit,
  },
})

export default withRouter(withStyles(styles)(Reports))
