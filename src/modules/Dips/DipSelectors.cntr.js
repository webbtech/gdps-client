import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'
import { withRouter } from 'react-router'

import * as errorActions from '../Error/errorActions'
import DipSelectors from './DipSelectors'

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  ),
)(DipSelectors)
