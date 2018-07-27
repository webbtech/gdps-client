import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DipForm from './DipForm'
import DipOverShort from './DipOverShort'
import DipSelectors from './DipSelectors'
import Header from '../Header/Header'
import { extractPathParts, datePrevDay, dateToInt } from '../../utils/utils'
import { styles as ms } from '../../styles/main'

import { errorSend } from '../Error/errorActions'


const DIP_QUERY = gql`
  query Dips($date: Int!, $dateFrom: Int!, $dateTo: Int!, $stationID: String!) {
    dips(date: $date, stationID: $stationID) {
      fuelType
      level
      litres
      stationTankID
      fuelDelivery {
        litres
      }
    }
    fuelPrice(date: $date, stationID: $stationID) {
      price
    }
    dipOverShortRange(dateFrom: $dateFrom, dateTo: $dateTo, stationID: $stationID) {
      date
      overShort
    }
    stationTanks(stationID: $stationID) {
      id
      fuelType
      tankID
      tank {
        levels
        size
      }
    }
  }
`


class Dips extends Component {

  renderForm = () => {
    const { pathname } = this.props.location
    const date = pathname.split('/')[2]
    const stationID = pathname.split('/')[3]

    if (!date || ! stationID) return
    return <DipForm />
  }

  render() {

    const { classes, data, history } = this.props
    const { pathname } = this.props.location

    const pathPrts = extractPathParts(pathname)
    const requestDate = pathPrts ? pathPrts[0] : null
    const dateObj = moment(requestDate)
    let havePrevDayDips = false
    let editMode = false

    if (data && data.error) {
      return <p>Data Error :(</p>
    }

    if (data && data.loading === false && data.dipOverShortRange) {
      const curDay = dateToInt(requestDate)
      const prevDay = datePrevDay(requestDate)
      if (data.dipOverShortRange[0].date === prevDay) {
        havePrevDayDips = true
      }
      if (data.dipOverShortRange[1] && data.dipOverShortRange[1].date === curDay) {
        editMode = true
      }
    }

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>

          <Typography
              gutterBottom
              variant="headline"
          >Dip Entries</Typography>
          <Divider /><br />
          <DipSelectors />

          <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>

            <div style={{flex: 1}}>
              <DipForm
                  data={data}
                  editMode={editMode}
                  havePrevDayDips={havePrevDayDips}
              />
            </div>

            <div style={{flex: 1}}>
              <DipOverShort
                  data={data}
                  dateObj={dateObj}
              />
            </div>
          </div>

        </Paper>
      </div>
    )
  }
}

Dips.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

const mapDispatchToProps = dispatch => ({
  sendError: obj => dispatch(errorSend(obj)),
})

const DipsConnect = connect(
  null,
  mapDispatchToProps
)(withStyles(ms)(Dips))


export default graphql(DIP_QUERY, {
  skip: props => props.location.pathname.split('/').length <= 3,
  options: (props) => {
    const prts = extractPathParts(props.location.pathname)
    return ({
      variables: {
        date:       dateToInt(prts[0]),
        dateFrom:   datePrevDay(prts[0]),
        dateTo:     dateToInt(prts[0]),
        stationID:  prts[1],
      },
    })
  },
})(DipsConnect)
