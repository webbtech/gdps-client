import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Save from '@material-ui/icons/Save'


const DOWNLOAD_REPORT = gql`
mutation FuelSaleRangeSummaryDownload($dateFrom: String!, $dateTo: String!) {
fuelSaleRangeSummaryDownload(dateFrom: $dateFrom, dateTo: $dateTo) {
    dateStart
    dateEnd
    reportLink
  }
}
`

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    width: 600,
  },
})

class FuelSalesDwnld extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // month: moment(new Date()).subtract(1, 'months').format('MM'),
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (event) => {
    this.setState(() => ({ [event.target.name]: event.target.value, toasterMsg: '' }))
  }

  handleSubmit = () => {

  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Typography
          gutterBottom
          variant="h6"
        >Station Report Download
        </Typography>
      </div>
    )
  }
}
FuelSalesDwnld.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
}

export default withStyles(styles)(FuelSalesDwnld)
