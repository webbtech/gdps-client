import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import moment from 'moment'
import { withRouter } from 'react-router'

import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import DatePicker from 'material-ui-pickers/DatePicker'

// import { extractPathParts } from '../../utils/utils'
import { STD_DATE_FORMAT as dateFormat } from '../../config/constants'

class PropaneSelectors extends Component {
  state = {
    nextDisabled: true,
    selectedDate: moment(),
  }

  componentDidMount = () => {
    // const pathPrts = extractPathParts(this.props.location.pathname, 2)
    // if (!pathPrts) return

    const { match: { params } } = this.props
    if (!params.date) return
    const date = params.date
    // console.log('match: ', this.props.match.params)
    // console.log('date: ', date)
    // this.setState({ selectedDate: date }, this.handleGetEntry)
    this.setState({ selectedDate: moment(date) }, this.setNextDisabled)

    /* const { history, match } = this.props
    const { selectedDate } = this.state
    const dte = selectedDate.format(dateFormat)
    const uri = `${match.url}/${dte}`
    history.push(uri) */
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date }, this.handleGetEntry)
  }

  handleNextPrevDate = (val) => {
    const dte = this.state.selectedDate
    if (val === 'p') {
      dte.subtract(1, 'days')
    } else if (val === 'n') {
      dte.add(1, 'days')
    }
    this.setState({ selectedDate: dte }, this.handleGetEntry)
  }

  handleGetEntry = () => {
    this.setNextDisabled()
    const { history } = this.props
    const { selectedDate } = this.state

    const dte = selectedDate.format(dateFormat)
    // const uri = `${match.url}/${dte}`
    const uri = `/propane/${dte}`
    history.push(uri)
  }

  setNextDisabled = () => {
    const { selectedDate } = this.state
    const today = moment().format(dateFormat)
    this.setState({ nextDisabled: !selectedDate.isBefore(today) })
  }

  render() {
    const { classes } = this.props
    const { nextDisabled, selectedDate } = this.state

    return (
      <div className={classes.container}>
        <div className={classes.selectRow}>

          <div className={classNames([classes.cell], [classes.calendar])}>
            <FormControl className={classes.formControl}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  autoOk
                  disableFuture
                  format="MMM D, YYYY"
                  label="Date"
                  onChange={this.handleDateChange}
                  value={selectedDate}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </div>

          <div className={classes.cell}>
            <Button
              className={classes.navButton}
              color="secondary"
              onClick={() => this.handleNextPrevDate('p')}
              variant="fab"
            >
              <ArrowBack />
            </Button>
            <Button
              className={classes.navButton}
              color="secondary"
              disabled={nextDisabled}
              onClick={() => this.handleNextPrevDate('n')}
              variant="fab"
            >
              <ArrowForward />
            </Button>
          </div>

        </div>
      </div>
    )
  }
}

PropaneSelectors.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const styles = theme => ({
  cell: {
    flex: 'flex-grow',
    alignSelf: 'flex-end',
  },
  container: {
    marginBottom: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 160,
  },
  navButton: {
    margin: theme.spacing.unit,
    height: theme.spacing.unit * 4.5,
    width: theme.spacing.unit * 4.5,
    marginRight: 0,
  },
  selectRow: {
    display: 'inline-flex',
    flexDirection: 'row',
    marginBottom: theme.spacing.unit,
  },
})

const comp = withRouter(PropaneSelectors)
export default withStyles(styles)(comp)
