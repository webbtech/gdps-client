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


class ForgotPassword extends Component {

  state = {
    authData:     '',
    error:        '',
    loading:      false,
    password:     '',
    showConfirm:  false,
    snackMsg:     '',
    snackOpen:    false,
    token:        '',
    username:     '',
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleOpenSnack = msg => {
    this.setState({ snackOpen: true, snackMsg: msg})
  }

  handleClose = () => {
    this.setState({ snackOpen: false })
  }

  async onSubmitForm() {
    try {
      this.setState({ loading: true })
      const response = await Auth.forgotPassword(this.state.username)
      console.log(`ForgotPassword::onSubmitForm(): Response#1 = ${JSON.stringify(response, null, 2)}`) // eslint-disable-line
      this.setState({ authData: response, loading: false, showConfirm: true })
    } catch (err) {
      console.log(`ForgotPassword::onSubmitForm(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({ error: err, loading: false, snackMsg: err.message, snackOpen: true })
    }
  }

  async onConfirmSubmitted() {
    try {
      this.setState({ loading: true })
      const response = await Auth.forgotPasswordSubmit(this.state.username, this.state.token, this.state.password)
      console.log(`ForgotPassword::onConfirmSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`) // eslint-disable-line
      this.setState({ loading: false })
      this.props.onStateChange('signIn')
    } catch (err) {
      const errMsg = err.message || err
      console.log(`ForgotPassword::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({ error: errMsg, loading: false, snackMsg: errMsg, snackOpen: true })
    }
  }

  renderSendCode = () => {
    const { classes, onStateChange } = this.props
    const { loading, username } = this.state
    return (
      <div className={classes.formContainer}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
              autoFocus={username === ''}
              id="username"
              name="username"
              onChange={this.handleChange}
              // type="email"
              value={username}
          />
        </FormControl>

        <Button
            className={classes.submitButton}
            color="primary"
            disabled={loading}
            onClick={() => this.onSubmitForm()}
            variant="contained"
        >
          {loading ? ('Stand by...') : ('Send Code')}
        </Button>

        <Button
            className={classes.returnButton}
            onClick={() => onStateChange('signIn')}
            size="small"
        >
          <Typography
              color="inherit"
              variant="body1"
          >
            Return to Sign In
          </Typography>
        </Button>
      </div>
    )
  }

  renderConfirmPassword = () => {

    const { classes } = this.props
    const { token, loading, password } = this.state

    return (
      <div className={classes.formContainer}>
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="token">Code</InputLabel>
            <Input
                autoFocus
                id="token"
                name="token"
                onChange={this.handleChange}
                value={token}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
                id="password"
                name="password"
                onChange={this.handleChange}
                type="password"
                value={password}
            />
          </FormControl>

          <Button
              className={classes.submitButton}
              color="primary"
              disabled={loading}
              onClick={() => this.onConfirmSubmitted()}
              variant="contained"
          >
            {loading ? ('Stand by...') : ('Confirm')}
          </Button>
      </div>
    )
  }

  render() {

    const { authState, classes } = this.props
    const { showConfirm, snackOpen, snackMsg } = this.state

    if (authState !== 'forgotPassword') return null

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
                Forgot Password
              </Typography>
            </Toolbar>
          </AppBar>
          {!showConfirm ? (this.renderSendCode()) : (this.renderConfirmPassword())}
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

ForgotPassword.propTypes = {
  authState:      PropTypes.string,
  classes:  PropTypes.object.isRequired,
  onStateChange:  PropTypes.func.isRequired,
}


const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    width:          theme.spacing.unit * 50,
    margin:         'auto',
    marginTop:      theme.spacing.unit * 2,
  },
  formContainer: {
    display:        'flex',
    flexDirection:  'column',
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  returnButton: {
    margin:     theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginTop:  0,
    width:      theme.spacing.unit * 20,
    padding:    0,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(ForgotPassword)
