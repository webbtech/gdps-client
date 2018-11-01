import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Auth } from 'aws-amplify'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


class SignIn extends Component {
  state = {
    error: '',
    name: '',
    password: '',
    loading: false,
    snackOpen: false,
    snackMsg: '',
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

  async onSubmit() {
    try {
      this.setState({ loading: true })
      // const response = await Auth.forgotPasswordSubmit(this.state.username, this.state.token, this.state.password)
      // completeNewPassword(user: any, password: string, requiredAttributes: any)

      const { authData } = this.props
      const response = await Auth.completeNewPassword(authData, this.state.password, { name: this.state.name })
      console.log(`RequireNewPassword::onSubmit(): Response#2 = ${JSON.stringify(response, null, 2)}`) // eslint-disable-line
      this.setState({ loading: false, name: '' })

      if ('challengeName' in authData && authData.challengeName === 'SMS_MFA') {
        this.props.onStateChange('confirmSignIn', authData)
      }
    } catch (err) {
      const errMsg = err.message || err
      console.log(`RequireNewPassword::onSubmit(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({
        error: errMsg, loading: false, snackMsg: errMsg, snackOpen: true,
      })
    }
  }

  render() {
    const { authState, classes } = this.props
    const {
      loading, snackOpen, snackMsg, password, name,
    } = this.state

    if (authState !== 'requireNewPassword') return null

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
                Set Name and Password
              </Typography>
            </Toolbar>
          </AppBar>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="name">Full Name</InputLabel>
            <Input
              autoFocus={name === ''}
              id="name"
              name="name"
              onChange={this.handleChange}
              value={name}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="password">New Password</InputLabel>
            <Input
              id="password"
              name="password"
              onChange={this.handleChange}
              type="password"
              value={password}
            />
            <FormHelperText id="password-helper-text">Enter new password with min 8 chars, 1 number, 1 upper case, 1 special character</FormHelperText>
          </FormControl>

          <Button
            className={classes.submitButton}
            color="primary"
            disabled={loading}
            onClick={() => this.onSubmit()}
            variant="contained"
          >
            {loading ? ('Stand by...') : ('Submit Name & Password')}
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
  authData: PropTypes.object,
  authState: PropTypes.string,
  onSignIn: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
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
  returnButton: {
    margin: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginTop: 0,
    width: theme.spacing.unit * 20,
    padding: 0,
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
  },

})

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SignIn)
