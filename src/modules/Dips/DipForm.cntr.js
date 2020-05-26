import gql from 'graphql-tag'
import { bindActionCreators } from 'redux'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import { withRouter } from 'react-router'

import DipForm from './DipForm'
import * as errorActions from '../Error/errorActions'
import { datePrevDay, dateToInt } from '../../utils/date'
import { DIP_QUERY } from './Dips.cntr'


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
    PersistDip: fields => mutate({
      variables: { fields },
      errorPolicy: 'all',
    }),
  }),
  options: ({ match: { params } }) => ({
    refetchQueries: [
      {
        query: DIP_QUERY,
        variables: {
          date: dateToInt(params.date),
          dateFrom: datePrevDay(params.date),
          dateTo: dateToInt(params.date),
          stationID: params.stationID,
        },
      },
    ],
  }),
  errorPolicy: 'all',
})

const validateInput = (fields) => {
  const errors = []
  const deliveries = {}
  const fieldIDs = Object.keys(fields)

  fieldIDs.forEach((id) => {
    const f = fields[id]
    if (!deliveries[f.tank.fuelType]) {
      deliveries[f.tank.fuelType] = 0
    }
    if (f.delivery) {
      deliveries[f.tank.fuelType] += f.delivery
    }
  })

  fieldIDs.forEach((id) => {
    const f = fields[id]
    if (f.level > f.prevLevel && !deliveries[f.tank.fuelType]) {
      errors.push({
        tankID: id,
        message: `Tank level cannot be higher than previous day (${f.prevLevel}) without a fuel delivery`,
      })
    }
    if (f.level > 0 && f.litres <= 0) {
      errors.push({
        tankID: id,
        message: 'Invalid litres value.',
      })
    }
  })

  return errors
}

const extractInput = (date, stationID, fields) => {
  const ret = []
  const fieldIDs = Object.keys(fields)

  fieldIDs.forEach((id) => {
    const f = fields[id]
    ret.push({
      date,
      delivery: f.delivery ? Number(f.delivery) : null,
      fuelType: f.tank.fuelType,
      level: f.level || 0,
      litres: f.litres || 0,
      stationID,
      stationTankID: id,
    })
  })
  return ret
}

// see: https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema
// for possible method to valid our fields
const DipFormCntr = withFormik({

  enableReinitialize: true,
  mapPropsToValues: ({ tankDips }) => ({ tanks: tankDips }),
  handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
    props.actions.errorClear()

    const validateErrors = validateInput(values.tanks)
    if (validateErrors.length) {
      const errs = {}
      validateErrors.forEach((e) => {
        props.actions.errorSend({ message: e.message, type: 'danger' })
        errs[e.tankID] = e.message
        setErrors(errs)
      })
      setSubmitting(false)
      return
    }

    const { actions, match: { params } } = props
    let graphqlReturn
    const submitVals = extractInput(dateToInt(params.date), params.stationID, values.tanks)
    try {
      graphqlReturn = await props.PersistDip(submitVals)
      if (graphqlReturn && graphqlReturn.errors) {
        setSubmitting(false)
        actions.errorSend({ message: graphqlReturn.errors[0].message, type: 'danger' })
      }
    } catch (error) {
      setSubmitting(false)
      actions.errorSend({ message: error.message, type: 'danger' })
    }
  },
  displayName: 'DipForm',
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
  PersistDip,
  connect(
    null,
    mapDispatchToProps
  ),
  DipFormCntr,
)(DipForm)
