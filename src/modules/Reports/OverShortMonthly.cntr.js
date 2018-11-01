import gql from 'graphql-tag'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import OverShortMonthly from './OverShortMonthly'
import * as errorActions from '../Error/errorActions'

const OSM_REPORT_QUERY = gql`
query DipOSMonthReport($date: String!, $stationID: String!) {
  dipOSMonthReport(date: $date, stationID: $stationID) {
    stationID
    fuelTypes
    period
    overShort {
      date
      data
    }
    overShortSummary
  }
}
`

const fetchOSMonthly = graphql(OSM_REPORT_QUERY, {
  skip: ({ match }) => !match || !match.params.date || !match.params.stationID,
  options: ({ match }) => ({
    variables: {
      date: moment(match.params.date).format('YYYY-MM-DD'),
      stationID: match.params.stationID,
    },
  }),
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  fetchOSMonthly,
  connect(
    null,
    mapDispatchToProps
  ),
)(OverShortMonthly)
