import gql from 'graphql-tag'
import { graphql } from '@apollo/react-hoc'
import { flowRight as compose } from 'lodash'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import Dips from './Dips'
import * as errorActions from '../Error/errorActions'
import { datePrevDay, dateToInt } from '../../utils/date'

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

const FUEL_SALE_LATEST = gql`
query FuelSaleLatest($stationID: String!) {
  fuelSaleLatest(stationID: $stationID) {
    date
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
        date: dateToInt(date),
        dateFrom: datePrevDay(date),
        dateTo: dateToInt(date),
        stationID,
      },
    })
  },
})

const FetchTanks = graphql(STATION_TANK_QUERY, {
  name: 'tanks',
  skip: ({ match }) => !match || !match.params.stationID,
  options: ({ match }) => ({
    variables: { stationID: match.params.stationID },
  }),
})

const FetchFuelSale = graphql(FUEL_SALE_LATEST, {
  name: 'fuelSaleLatest',
  skip: ({ match }) => !match || !match.params.stationID,
  options: ({ match }) => ({
    variables: { stationID: match.params.stationID },
  }),
})

/* const mapDispatchToProps = dispatch => ({
  sendError: obj => dispatch(errorSend(obj)),
}) */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  FetchDips,
  FetchTanks,
  FetchFuelSale,
  connect(
    null,
    mapDispatchToProps
  ),
)(Dips)
