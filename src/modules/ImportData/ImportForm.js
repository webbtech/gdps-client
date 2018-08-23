import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import moment from 'moment'

import Button from '@material-ui/core/Button'
import Create from '@material-ui/icons/Create'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import FormLabel from '@material-ui/core/FormLabel'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import DatePicker from 'material-ui-pickers/DatePicker'

import Toaster from '../Common/Toaster'
import ImportLog from './ImportLog'
import { STD_DATE_FORMAT as dateFormat } from '../../config/constants'
import { MAX_IMPORT_DAYS as maxImportDays } from '../../config/constants'


const IMPORT_FUELSALES = gql`
mutation ImportData($dateStart: String!, $dateEnd: String!, $importType: String!) {
  importData(dateStart: $dateStart, dateEnd: $dateEnd, importType: $importType) {
    dateStart
    dateEnd
    importType
    importDate
    recordQty
  }
}
`

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

class ImportForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      importType: 'fuel',
      toasterMsg: '',
      selectedStartDate: moment(),
      selectedEndDate: moment(),
      startDate: '',
      endDate: '',
      skipQuery: true,
    }
  }

  handleStartDateChange = date => {
    this.setState({ selectedStartDate: date, startDate: date.format(dateFormat) }, this.validateDates)
  }

  handleEndDateChange = date => {
    this.setState({ selectedEndDate: date, endDate: date.format(dateFormat) }, this.validateDates)
  }

  handleImportTypeChange = event => {
    this.setState({ importType: event.target.value })
  }

  handleImportComplete = () => {
    this.setState({toasterMsg: 'Data import successfully completed'})
  }

  validateDates = () => {
    if (this.state.startDate && this.state.endDate) {
      const st = this.state.selectedStartDate
      const en = this.state.selectedEndDate
      const duration = moment.duration(en.diff(st)).as('days')
      if (duration > maxImportDays) {
        this.setState({
          skipQuery: true,
          toasterMsg: `Maximum number of days between dates: (${maxImportDays}) exceeded`,
        })
      } else {
        this.setState({skipQuery: false})
      }
    }
  }

  render() {

    const { importType, selectedStartDate, selectedEndDate } = this.state
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Paper className={classes.formContainer}>
          <div className={classes.formRow}>
            <div className={classes.formCell}>
              <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                      autoOk
                      disableFuture
                      format="MMM D, YYYY"
                      label="Start Date"
                      onChange={this.handleStartDateChange}
                      value={selectedStartDate}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </div>

            <div className={classes.formCell}>
              <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                      autoOk
                      disableFuture
                      format="MMM D, YYYY"
                      label="End Date"
                      onChange={this.handleEndDateChange}
                      value={selectedEndDate}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </div>

            <div className={classes.formCell}>
              <FormControl
                  className={classes.formControl}
                  component="fieldset"
              >
                {/*<FormLabel component="legend">Import Type</FormLabel>*/}
                <RadioGroup
                    aria-label="ImportType"
                    className={classes.radioGroup}
                    name="importType"
                    onChange={this.handleImportTypeChange}
                    value={importType}
                >
                  <FormControlLabel
                      control={<Radio />}
                      label="Fuel"
                      value="fuel"
                  />
                  <FormControlLabel
                      control={<Radio />}
                      // disabled
                      label="Propane"
                      value="propane"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div
                className={classes.formCell}
                style={{margin: 'auto'}}
            >
              <Mutation
                  mutation={IMPORT_FUELSALES}
                  onCompleted={this.handleImportComplete}
                  refetchQueries={[{query: IMPORT_LOG, variables: {importType}}]}
                  skip={this.state.skipQuery}
                  variables={{
                    dateStart: this.state.startDate,
                    dateEnd: this.state.endDate,
                    importType: this.state.importType,
                  }}
              >
                {(importData, { loading, error }) => (
                  <div>
                    <div className={classes.processMsg} />
                    <Button
                        className={classes.submitButton}
                        color="primary"
                        disabled={this.state.skipQuery}
                        onClick={importData}
                        variant="raised"
                    >Import Data
                      <Create className={classes.rightIcon} />
                    </Button>
                    <div className={classes.processMsg}>
                      {loading && <div>Processing...</div>}
                      {error && <div>Error :( Please try again</div>}
                    </div>
                  </div>
                )}
              </Mutation>
            </div>
          </div>
          <Divider /><br />
          <div className={classes.formRow}>
            <Typography
                gutterBottom
                variant="caption"
            >
              {`NOTE: Ensure dates exist in current Sales data, and do not exceed ${maxImportDays} days in duration.`}
            </Typography>
          </div>
        </Paper>
        <ImportLog importType={importType} />
        <Toaster message={this.state.toasterMsg} />
      </div>
    )
  }
}
ImportForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    width: 750,
    margin: 'auto',
  },
  formContainer: {
    display:        'flex',
    flexDirection:  'column',
    padding: theme.spacing.unit,
  },
  formRow: {
    display:        'flex',
    flexDirection: 'row',
  },
  formCell: {
    flexGrow: 1,
  },
  formControl: {
    margin:   theme.spacing.unit,
    minWidth: 120,
  },
  radioGroup: {
    margin: `${theme.spacing.unit}px 0`,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  processMsg: {
    height: 30,
  },
  submitButton: {
    margin: 'auto',
    marginBottom: theme.spacing.unit,
  },
})

export default withStyles(styles)(ImportForm)
