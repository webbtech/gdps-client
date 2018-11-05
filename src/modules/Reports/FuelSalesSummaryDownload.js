import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import moment from 'moment'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DatePicker from 'material-ui-pickers/DatePicker'


const styles = theme => ({
  cell: {
    flex: 'flex-grow',
    alignSelf: 'flex-end',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    width: 550,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  reportDetails: {
    color: theme.palette.grey['700'],
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: theme.spacing.unit * 4,
    '& li': {
      marginBottom: 6,
    },
  },
  selectRow: {
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit,
  },
})

class FuelSalesDwnld extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dateStart: moment(),
      dateEnd: moment(),
      // toasterMsg: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount = () => {
    const { setFieldValue } = this.props
    setFieldValue('dateStart', moment())
    setFieldValue('dateEnd', moment())
  }

  handleDateChange = (date, field) => {
    const { setFieldValue } = this.props
    this.setState(() => ({ [field]: date, toasterMsg: '' }))
    setFieldValue([field], date)
  }

  handleSubmit = (e) => {
    this.props.handleSubmit(e)
  }

  render() {
    const {
      classes,
      dirty,
      errors,
      isSubmitting,
    } = this.props
    const { dateEnd, dateStart } = this.state

    return (
      <div className={classes.container}>
        <Typography
          gutterBottom
          variant="h6"
        >Fuel Sale Summary Report Download
        </Typography>

        <form
          autoComplete="off"
          className={classes.container}
          noValidate
          onSubmit={this.handleSubmit}
        >
          <div className={classes.selectRow}>

            <div className={classNames([classes.cell], [classes.calendar])}>
              <FormControl
                className={classes.formControl}
                error={!!errors.dateStart}
              >
                <DatePicker
                  autoOk
                  disableFuture
                  format="MMM D, YYYY"
                  label="Start Date"
                  // id="dateStart"
                  // name="dateStart"
                  onChange={val => this.handleDateChange(val, 'dateStart')}
                  value={dateStart}
                />
                <FormHelperText id="startDate-text">{errors.dateStart}</FormHelperText>
              </FormControl>
            </div>

            <div className={classNames([classes.cell], [classes.calendar])}>
              <FormControl
                className={classes.formControl}
                error={!!errors.dateEnd}
              >
                <DatePicker
                  autoOk
                  disableFuture
                  format="MMM D, YYYY"
                  label="End Date"
                  onChange={val => this.handleDateChange(val, 'dateEnd')}
                  value={dateEnd}
                />
                <FormHelperText id="endDate-text">{errors.dateEnd}</FormHelperText>
              </FormControl>
            </div>

            <div className={classes.buttonCell}>
              <Button
                color="primary"
                disabled={!dirty || isSubmitting}
                onClick={() => this.handleSubmit()}
                variant="contained"
              >
                <Save className={classes.leftIcon} />
              Download
              </Button>
            </div>

          </div>
        </form>

        <div className={classes.reportDetails}>
          {'This report file download is an "xlsx" spreadsheet file and consists of the following data:'}
          <ul>
            <li>NoLead Fuel Sales Summary</li>
            <li>Diesel Fuel Sales Summary</li>
          </ul>
        </div>
      </div>
    )
  }
}
FuelSalesDwnld.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  dirty: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
}

export default withStyles(styles)(FuelSalesDwnld)
