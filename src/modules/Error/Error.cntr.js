import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { withStyles } from '@material-ui/core/styles'

import { errorDismiss } from './errorActions'
import Error from './Error'

function ErrorContainer({ classes, errors }) {
  const items = errors.map(err => (
    <CSSTransition
      classNames={{
        appear: classes.appear,
        appearActive: classes.appearActive,
        enter: classes.enter,
        enterActive: classes.enterActive,
        exit: classes.exit,
        exitActive: classes.exitActive,
      }}
      key={err.id}
      timeout={{ enter: 500, exit: 300 }}
    >
      <Error
        message={err.message}
        onClick={() => this.props.dismissError(err.id)}
        type={err.type}
      />
    </CSSTransition>
  ))

  return (
    <div className={classes.errContainer}>
      <TransitionGroup>
        {items}
      </TransitionGroup>
    </div>
  )
}
ErrorContainer.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  dismissError: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  errors: PropTypes.instanceOf(Array),
}
ErrorContainer.defaultProps = {
  errors: null,
}

const mapStateToProps = state => ({
  errors: state.errors,
})

const mapDispatchToProps = dispatch => ({
  dismissError: id => dispatch(errorDismiss(id)),
})

const styles = theme => ({
  errContainer: {
    backgroundColor: '#fff',
    fontFamily: theme.typography.fontFamily,
    left: 0,
    minWidth: 500,
    // paddingBottom:    theme.spacing.unit,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100,
  },
  enter: {
    opacity: 0.01,
  },
  enterActive: {
    opacity: 1,
    transition: 'opacity 500ms ease-in',
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0.01,
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
