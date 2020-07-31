import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Auth } from 'aws-amplify'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


class ConfirmSignIn extends Component {
  state = {
    // error: '',
    loading: false,
    snackMsg: '',
    snackOpen: false,
    code: '',
  }

  async onSubmit() {
    const { authData } = this.props
    try {
      this.setState({ loading: true })
      const mfaType = 'SMS_MFA'
      await Auth.confirmSignIn(authData, this.state.code, mfaType)
      this.setState({ loading: false, code: '' })
    } catch (err) {
      const errMsg = err.message || err
      console.log(`RequireNewPassword::onSubmit(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({
        // error: errMsg, loading: false, snackMsg: errMsg, snackOpen: true,
        loading: false, snackMsg: errMsg, snackOpen: true,
      })
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleOpenSnack = (msg) => {
    this.setState({ snackOpen: true, snackMsg: msg })
  }

  handleClose = () => {
    this.setState({ snackOpen: false })
  }

  render() {
    const { authState, classes } = this.props
    const {
      loading, snackOpen, snackMsg, code,
    } = this.state

    if (authState !== 'confirmSignIn') return null

    return (
      <div>
        <Paper className={classes.container}>
          <AppBar
            color="secondary"
            position="static"
          >
            <Toolbar>
              <Typography
                color="inherit"
                variant="h6"
              >
                Confirm Code
              </Typography>
            </Toolbar>
          </AppBar>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="code">Code</InputLabel>
            <Input
              autoFocus
              id="code"
              name="code"
              onChange={this.handleChange}
              value={code}
            />
          </FormControl>

          <Button
            className={classes.submitButton}
            color="primary"
            disabled={loading}
            onClick={() => this.onSubmit()}
            variant="contained"
          >
            {loading ? 'Stand by...' : 'Confirm'}
          </Button>
        </Paper>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          message={<span id="message-id">{snackMsg}</span>}
          onClose={this.handleClose}
          open={snackOpen}
        />
      </div>
    )
  }
}

ConfirmSignIn.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  authState: PropTypes.string,
  // onSignIn: PropTypes.func.isRequired,
  // onStateChange: PropTypes.func.isRequired,
}
ConfirmSignIn.defaultProps = {
  authState: null,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    width: theme.spacing.unit * 50,
    margin: 'auto',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(ConfirmSignIn)
