import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import gql from 'graphql-tag'
import { graphql } from '@apollo/react-hoc'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Save from '@material-ui/icons/Save'

// import Toaster from '../Common/Toaster'
import { setMonths, setYears } from '../../utils/formUtils'

const DOWNLOAD_REPORT = gql`
mutation PropaneSignedURL($date: String!) {
  propaneSignedURL(date: $date) {
    date
    reportLink
  }
}
`

class PropaneReportDownload extends Component {
  state = {
    month: moment(new Date()).subtract(1, 'months').format('MM'),
    toasterMsg: '',
    year: (new Date()).getFullYear(),
  }

  handleChange = (event) => {
    this.setState(() => ({ [event.target.name]: event.target.value, toasterMsg: '' }))
  }

  handleSubmit = () => {
    const yr = this.state.year.toString()
    const date = `${yr}-${this.state.month}-01`
    const m = moment(date)
    if (!m.isValid()) {
      this.setState(() => ({ toasterMsg: 'Invalid date' }))
      return
    }
    const today = moment().startOf('month')
    if (today.isBefore(date)) {
      this.setState(() => ({ toasterMsg: 'Invalid date. Select an earlier date.' }))
      return
    }
    const variables = {
      date,
    }
    const tabOpen = window.open(`${window.location.origin}/download`, '_new')

    this.props.mutate({
      variables,
    })
      .then(({ data }) => {
        tabOpen.location = data.propaneSignedURL.reportLink
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
          gutterBottom
          variant="h6"
        >Propane Report Download
        </Typography>
        <div className={classes.selectRow}>

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
                {setYears().map(yr => (
                  <MenuItem
                    key={yr}
                    value={yr}
                  >{yr}
                  </MenuItem>
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
                {setMonths().map(m => (
                  <MenuItem
                    key={m.key}
                    value={m.key}
                  >{m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.buttonCell}>
            <Button
              color="primary"
              onClick={() => this.handleSubmit()}
              variant="contained"
            >
              <Save className={classes.leftIcon} />
            Download Report
            </Button>
          </div>

        </div>

        <div className={classes.reportDetails}>
          This report file download is a "xlsx" spreadsheet file and consists of Propane Sales and Delivery information
        </div>
      </div>
    )
  }
}
PropaneReportDownload.propTypes = {
  classes: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    width: 450,
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
    display: 'inline-flex',
    flexDirection: 'row',
  },
})

const styledForm = withStyles(styles)(PropaneReportDownload)

export default graphql(DOWNLOAD_REPORT, {
  skip: true,
})(styledForm)
