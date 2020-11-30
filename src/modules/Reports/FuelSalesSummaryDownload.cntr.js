import gql from 'graphql-tag'
import { bindActionCreators } from 'redux'
import { graphql } from '@apollo/react-hoc'
import { flowRight as compose } from 'lodash'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import moment from 'moment'

import FuelSalesDwnld from './FuelSalesSummaryDownload'
import * as errorActions from '../Error/errorActions'

const DOWNLOAD_REPORT = gql`
mutation FuelSaleRangeSummaryDownload($dateFrom: String!, $dateTo: String!) {
  fuelSaleRangeSummaryDownload(dateFrom: $dateFrom, dateTo: $dateTo) {
    dateStart
    dateEnd
    reportLink
  }
}
`
const FetchReport = graphql(DOWNLOAD_REPORT, {
  props: ({ mutate }) => ({
    FetchReport: fields => mutate({
      variables: fields,
      errorPolicy: 'all',
    }),
  }),
})

const validateInput = ({ dateStart, dateEnd }) => {
  const errors = {}
  const today = moment()

  if (!dateStart.isValid()) {
    errors.dateStart = 'Invalid date.'
  }
  if (!dateEnd.isValid()) {
    errors.dateEnd = 'Invalid date.'
  }
  if (dateStart.isAfter(today.subtract(1, 'days'))) {
    errors.dateStart = 'starting date must be before current date.'
  }
  if (dateStart.isAfter(dateEnd)) {
    errors.dateStart = 'starting date must be before ending date.'
  }
  return errors
}

const FuelSalesDwnldCntr = withFormik({
  enableReinitialize: true,
  handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
    const validateErrors = validateInput(values)
    const haveErrors = !!Object.keys(validateErrors).length
    if (haveErrors) {
      setErrors(validateErrors)
      setSubmitting(false)
      return
    }

    const { actions } = props
    const { dateStart, dateEnd } = values
    const fields = {
      dateFrom: dateStart.format('YYYY-MM-DD'),
      dateTo: dateEnd.format('YYYY-MM-DD'),
    }
    let graphqlReturn
    // to avoid pop-up alerts, window has to be opened before any action
    const tabOpen = window.open(`${window.location.origin}/download`, '_new')
    try {
      setSubmitting(true)
      graphqlReturn = await props.FetchReport(fields)
      setSubmitting(false)
      if (graphqlReturn && graphqlReturn.errors) {
        actions.errorSend({ message: graphqlReturn.errors[0].message, type: 'danger' })
      } else {
        tabOpen.location = graphqlReturn.data.fuelSaleRangeSummaryDownload.reportLink
      }
    } catch (error) {
      setSubmitting(false)
      actions.errorSend({ message: error.message, type: 'danger' })
    }
  },
  displayName: 'FSDwnldForm',
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  FetchReport,
  connect(
    null,
    mapDispatchToProps
  ),
  FuelSalesDwnldCntr,
)(FuelSalesDwnld)
