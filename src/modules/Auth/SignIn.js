/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from 'react'
import { JS, ConsoleLogger as Logger } from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'

import AuthPiece from './AuthPiece'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const logger = new Logger('SignIn')

class SignIn extends AuthPiece {

  constructor(props) {
    super(props)
    this.checkContact = this.checkContact.bind(this)
    this.signIn = this.signIn.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp']
    this.state = {
      loading: false,
      snackOpen: false,
      snackMsg: '',
    }
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = e => {
    if (this.props.authState === 'signIn') {
      if (e.keyCode === 13) { // when press enter
        this.signIn()
      }
    }
  }

  handleOpen = msg => {
    this.setState({ snackOpen: true, snackMsg: msg})
  }

  handleClose = () => {
    this.setState({ snackOpen: false })
  }

  checkContact = user => {
    if (!Auth || typeof Auth.verifiedContact !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.verifiedContact(user)
      .then(data => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user)
        } else {
          user = Object.assign(user, data)
          this.changeState('verifyContact', user)
        }
      })
  }

  signIn = () => {
    const { username, password } = this.inputs
    this.setState({ loading: true })

    if (!Auth || typeof Auth.signIn !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.signIn(username, password)
      .then(user => {
        this.setState({ loading: false })
        logger.debug(user)
        if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          logger.debug(`confirm user with ${user.challengeName}`)
          this.changeState('confirmSignIn', user)
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          logger.debug('require new password', user.challengeParam)
          this.changeState('requireNewPassword', user)
        } else if (user.challengeName === 'MFA_SETUP') {
          logger.debug('TOTP setup', user.challengeParam)
          this.changeState('TOTPSetup', user)
        }
        else {
          this.checkContact(user)
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        if (err.code === 'UserNotConfirmedException') {
          logger.debug('the user is not confirmed')
          this.changeState('confirmSignUp')
        }
        else if (err.code === 'PasswordResetRequiredException') {
          logger.debug('the user requires a new password')
          this.changeState('requireNewPassword')
        } else {
          const errMsg = typeof err === 'object' ? err.message : err
          this.setState({ loading: false, snackMsg: errMsg, snackOpen: true })
        }
      })
  }

  showComponent = () => {
    const { classes, onStateChange } = this.props
    const { loading, snackMsg, snackOpen } = this.state

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
                Sign In To Your Account
              </Typography>
            </Toolbar>
          </AppBar>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
                autoFocus
                id="username"
                key="username"
                name="username"
                onChange={this.handleInputChange}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
                id="password"
                key="password"
                name="password"
                onChange={this.handleInputChange}
                type="password"
            />
          </FormControl>

          <Button
              className={classes.submitButton}
              color="primary"
              onClick={this.signIn}
              variant="contained"
          >
            {loading ? ('Stand by...') : ('Sign In')}
          </Button>

          <Button
              className={classes.forgotButton}
              onClick={() => onStateChange('forgotPassword')}
              size="small"
          >
              Forgot Password
          </Button>

        </Paper>

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
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={6000}
            message={<span id="message-id">{snackMsg}</span>}
            onClose={this.handleClose}
            open={snackOpen}
        />
      </div>
    )
  }
}

const styles = theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    width:          theme.spacing.unit * 50,
    margin:         'auto',
    marginTop:      theme.spacing.unit * 2,
  },
  forgotButton: {
    margin:       'auto',
    marginBottom: theme.spacing.unit,
    width:        theme.spacing.unit * 20,
    padding:      0,
    color:        theme.palette.secondary.main,
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
