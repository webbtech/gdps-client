import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Dips from './Dips'
import { errorSend } from '../Error/errorActions'
import { datePrevDay, dateToInt } from '../../utils/utils'

export const DIP_QUERY = gql`
  query Dips($date: Int!, $dateFrom: Int!, $dateTo: Int!, $stationID: String!) {
    curDips: dips(date: $date, stationID: $stationID) {
      date
      fuelType
      level
      litres
      stationTankID
      fuelDelivery {
        litres
      }
    }
    prevDips: dips(date: $dateFrom, stationID: $stationID) {
      date
      fuelType
      level
      litres
      stationTankID
    }
    fuelPrice(date: $date, stationID: $stationID) {
      date
      price
      stationID
    }
    dipOverShortRange(dateFrom: $dateFrom, dateTo: $dateTo, stationID: $stationID) {
      date
      overShort
      stationID
    }
  }
`

const STATION_TANK_QUERY = gql`
query StationTanks($stationID: String!) {
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

const FetchDips = graphql(DIP_QUERY, {
  name: 'dips',
  skip: ({ match }) => !match || !match.params.date || !match.params.stationID,
  options: ({ match }) => {
    const { date, stationID } = match.params
    return ({
      variables: {
        date:       dateToInt(date),
        dateFrom:   datePrevDay(date),
        dateTo:     dateToInt(date),
        stationID,
      },
    })
  },
})

const FetchTanks = graphql(STATION_TANK_QUERY, {
  name: 'tanks',
  skip: ({ match }) => !match || !match.params.stationID,
  options: ({ match }) => ({
    variables: {stationID: match.params.stationID},
  }),
})

const mapDispatchToProps = dispatch => ({
  sendError: obj => dispatch(errorSend(obj)),
})

export default compose(
  FetchDips,
  FetchTanks,
  connect(
    null,
    mapDispatchToProps
  ),
)(Dips)
