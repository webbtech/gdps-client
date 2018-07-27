import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { errorDismiss } from './errorActions'

import { CSSTransitionGroup } from 'react-transition-group'
import { withStyles } from '@material-ui/core/styles'

import Error from './Error'

class ErrorContainer extends Component {

  render() {

    const { classes, errors } = this.props

    const items = errors.map(err => {
      return (
        <Error
            key={err.id}
            message={err.message}
            onClick={() => this.props.dismissError(err.id)}
            type={err.type}
        />
      )
    })

    return (
      <div className={classes.errContainer}>
        <CSSTransitionGroup
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            transitionName={{
              enter: classes.enter,
              enterActive: classes.enterActive,
              leave: classes.leave,
              leaveActive: classes.leaveActive,
              appear: classes.appear,
              appearActive: classes.appearActive,
            }}
        >
          {items}
        </CSSTransitionGroup>
      </div>
    )
  }
}

ErrorContainer.propTypes = {
  classes:      PropTypes.object.isRequired,
  dismissError: PropTypes.func.isRequired,
  errors:       PropTypes.array,
}

const mapStateToProps = state => ({
  errors:   state.errors,
})

const mapDispatchToProps = dispatch => ({
  dismissError: id => dispatch(errorDismiss(id)),
})

const styles = theme => ({
  errContainer: {
    backgroundColor: '#fff',
    fontFamily:       theme.typography.fontFamily,
    left:             0,
    minWidth:         500,
    paddingBottom:    theme.spacing.unit,
    position:         'fixed',
    top:              0,
    width:            '100%',
    zIndex:           100,
  },
  enter: {
    opacity: 0.01,
  },
  enterActive: {
    opacity:    1,
    transition: 'opacity 500ms ease-in',
  },
  leave: {
    opacity: 1,
  },
  leaveActive: {
    opacity:    0.01,
    transition: 'opacity 300ms ease-in',
  },
  appear: {
    opacity: 0.01,
  },
  appearActive: {
    opacity: 1,
    transition: 'opacity .5s ease-in',
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ErrorContainer))