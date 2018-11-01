import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import OverShortAnnually from './OverShortAnnually'
import * as errorActions from '../Error/errorActions'

const OSA_REPORT_QUERY = gql`
query DipOSAnnualReport($date: String!, $stationID: String!) {
  dipOSAnnualReport(date: $date, stationID: $stationID) {
    fuelTypes
    months
    summary
    year
  }
}
`

const fetchOSAnnual = graphql(OSA_REPORT_QUERY, {
  skip: ({ match }) => !match || !match.params.year || !match.params.stationID,
  options: ({ match }) => ({
    variables: {
      date: moment().year(match.params.year).format('YYYY-MM-DD'),
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
  fetchOSAnnual,
  connect(
    null,
    mapDispatchToProps
  ),
)(OverShortAnnually)
