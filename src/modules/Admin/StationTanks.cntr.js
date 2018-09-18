import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router'

import StationTanks from './StationTanks'

export const TANK_QUERY = gql`
query StationTanksWithList($stationID: String!) {
  stationTanksWithList(stationID: $stationID) {
    currentTanks {
      id
      active
      fuelType
      tankID
      tank {
        id
        size
      }
    }
  }
}
`

export const TOGGLE_ACTIVE_MUTATION = gql`
mutation ToggleActive($fields: StationTankActiveInput) {
  toggleActive(input: $fields) {
    ok
    nModified
  }
}
`

const FetchTanks = graphql(TANK_QUERY, {
  skip: ({ match }) => !match || !match.params.stationID,
  options: ({ match }) => ({
    variables: {stationID: match.params.stationID},
  }),
})


export default compose(
  withApollo,
  withRouter,
  FetchTanks,
)(StationTanks)
