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


class SignIn extends Component {

  state = {
    error:      '',
    loading:    false,
    name:       '',
    password:   '',
    snackMsg:   '',
    snackOpen:  false,
    username:   '',
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

  async onSignIn() {
    this.setState({ loading: true })
    try {
      const authData = await Auth.signIn(this.state.username, this.state.password)
      // console.log(`onSignIn::Response#1: ${JSON.stringify(authData, null, 2)}`) // eslint-disable-line
      this.setState({
        error: '',
        loading: false,
        snackMsg: '',
        snackOpen: false,
        username: '',
      })

      // If the user session is not null, then we are authenticated
      if (authData.signInUserSession !== null) {
        console.log('authData.signInUserSession: ', authData.signInUserSession) // eslint-disable-line
        return
      }

      // If there is a challenge, then show the modal
      if ('challengeName' in authData) {
        console.log(`onSignIn: Expecting challenge to be recieved via ${authData.challengeName}`) // eslint-disable-line
        if (authData.challengeName === 'NEW_PASSWORD_REQUIRED') {
          this.props.onStateChange('requireNewPassword', authData)
        } else if (authData.challengeName === 'SMS_MFA') {
          this.props.onStateChange('confirmSignIn', authData)
        }
        return
      }

      // Anything else and there is a problem
      throw new Error('Invalid response from server')
    } catch (err) {
      const errMsg = err.message || err
      console.log(`Error: ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({ error: err.message, loading: false, snackMsg: errMsg, snackOpen: true })
    }
  }

  render() {

    const { authState, classes, onStateChange } = this.props
    const { loading, password, snackOpen, snackMsg, username } = this.state

    if (authState !== 'signIn') return null

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
                  variant="title"
              >
                Sign In Account
              </Typography>
            </Toolbar>
          </AppBar>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
                autoFocus={username === ''}
                id="username"
                name="username"
                onChange={this.handleChange}
                type="email"
                value={username}
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
              onClick={() => this.onSignIn()}
              variant="raised"
          >
            {loading ? ('Stand by...') : ('Sign In')}
          </Button>
          <Button
              className={classes.forgotButton}
              onClick={() => onStateChange('forgotPassword')}
              size="small"
          >
            <Typography
                color="inherit"
                variant="body1"
            >
              Forgot Password
            </Typography>
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

SignIn.propTypes = {
  authState:      PropTypes.string,
  classes:        PropTypes.object.isRequired,
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
  forgotButton: {
    margin:     theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginTop:  0,
    width:      theme.spacing.unit * 20,
    padding:    0,
  },
  formContainer: {
    display:        'flex',
    flexDirection:  'column',
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(SignIn)
