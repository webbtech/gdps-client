import * as errorActions from '../Error/errorActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'
import { withRouter } from 'react-router'

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
