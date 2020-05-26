import gql from 'graphql-tag'
import { bindActionCreators } from 'redux'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import { withRouter } from 'react-router'

import PropaneForm from './PropaneForm'
import { dateToInt } from '../../utils/date'
import * as errorActions from '../Error/errorActions'

const DELIVERY_QUERY = gql`
query PropaneDelivery($date: Int!) {
  propaneDelivery(date: $date) {
    date
    litres
  }
}
`

const CREATE_DELIVERY = gql`
mutation CreatePropaneDelivery($fields: PropaneDeliverInput!) {
  createPropaneDelivery(input: $fields) {
    ok
    nModified
  }
}
`

const REMOVE_DELIVERY = gql`
mutation RemovePropaneDelivery($fields: PropaneRemoveDeliverInput!) {
  removePropaneDelivery(input: $fields) {
    ok
    nModified
  }
}
`

const FetchDelivery = graphql(DELIVERY_QUERY, {
  name: 'propane',
  skip: ({ match }) => !match || !match.params.date,
  options: ({ match }) => ({
    variables: { date: dateToInt(match.params.date) },
  }),
})

const PersistDelivery = graphql(CREATE_DELIVERY, {
  props: ({ mutate }) => ({
    PersistDelivery: fields => mutate({
      variables: { fields },
      errorPolicy: 'all',
    }),
  }),
  options: ({ match: { params } }) => ({
    refetchQueries: [{
      query: DELIVERY_QUERY,
      variables: {
        date: params.date ? dateToInt(params.date) : '',
      },
    }],
  }),
  skip: ({ match }) => !match || !match.params.date,
})

const RemoveDelivery = graphql(REMOVE_DELIVERY, {
  props: ({ mutate }) => ({
    RemoveDelivery: fields => mutate({
      variables: { fields },
      errorPolicy: 'all',
    }),
  }),
  options: ({ match: { params } }) => ({
    refetchQueries: [{
      query: DELIVERY_QUERY,
      variables: {
        date: params.date ? dateToInt(params.date) : '',
      },
    }],
  }),
})

const PropaneFormCntr = withFormik({

  enableReinitialize: true,
  mapPropsToValues: ({ propane }) => {
    const litres = propane && propane.propaneDelivery ? propane.propaneDelivery.litres : ''
    return { litres }
  },
  handleSubmit: async (values, { props, setSubmitting }) => {
    props.actions.errorClear()

    let graphqlReturn
    const { actions, match: { params } } = props
    const submitVals = {
      date: dateToInt(params.date),
      litres: Number(values.litres),
    }
    try {
      graphqlReturn = await props.PersistDelivery(submitVals)
      if (graphqlReturn && graphqlReturn.errors) {
        setSubmitting(false)
        actions.errorSend({ message: graphqlReturn.errors[0].message, type: 'danger' })
      }
    } catch (error) {
      setSubmitting(false)
      actions.errorSend({ message: error.message, type: 'danger' })
    }
  },
  displayName: 'PropaneForm',
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  withRouter,
  FetchDelivery,
  PersistDelivery,
  RemoveDelivery,
  connect(
    null,
    mapDispatchToProps
  ),
  PropaneFormCntr,
)(PropaneForm)
