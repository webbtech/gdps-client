import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'
import { connect } from 'react-redux'


import { bindActionCreators } from 'redux'

import DipForm from './DipForm.cont'
import * as errorActions from '../Error/errorActions'


const CREATE_DIPS = gql`
mutation CreateDips($fields: [DipInput]) {
  createDips(input: $fields) {
    ok
    nModified
  }
}
`

const PersistDip = graphql(CREATE_DIPS, {
  props: ({ mutate }) => ({
    UpdateDip: (fields) => mutate({
      variables: {fields},
      errorPolicy: 'all',
    }),
  }),
  options: (props) => ({
    /*onCompleted: () => {
    // onCompleted: (result, errs) => {
      // console.log('result: ', result)
      props.history.push('/admin/tank-admin')
    },*/
    // refetchQueries: [{query: TANKLIST_QUERY}],
  }),
  errorPolicy: 'all',
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  withApollo,
  PersistDip,
  connect(
    null,
    mapDispatchToProps
  ),
)(DipForm)