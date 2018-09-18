import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

class Toaster extends Component {

  state = {
    duration: 3000,
    open: false,
    message: '',
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.open === false && this.props.message) {
      this.setState({message: this.props.message, open: true})
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ open: false, message: '' })
  }

  handleOpen = (message) => {
    this.setState({ open: true, message })
  }

  render() {

    const { classes, message } = this.props
    const duration = this.props.duration || this.state.duration

    return (
      <Snackbar
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          action={[
            <IconButton
                aria-label="Close"
                className={classes.close}
                color="inherit"
                key="close"
                onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={duration}
          message={<span id="message-id">{message}</span>}
          onClose={this.handleClose}
          open={this.state.open}
      />
    )
  }
}
Toaster.propTypes = {
  classes:  PropTypes.object.isRequired,
  duration:  PropTypes.number,
  message:  PropTypes.string,
}

const styles = theme => ({
  close: {
    width:  theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
})

export default withStyles(styles)(Toaster)
