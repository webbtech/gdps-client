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
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'


class Profile extends Component {

  state = {
    error:        '',
    loading:      false,
    passwordConfirm:  '',
    passwordNew:  '',
    passwordOld:  '',
    snackMsg:     '',
    snackOpen:    false,
    user:         {},
  }

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(
        (result) => {
          this.setState({
            user:     result,
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            loading: false,
            error,
          })
        }
      )
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

    this.setState({ loading: true })
    if (this.state.passwordOld === '') {
      this.setState({ loading: false, snackOpen: true, snackMsg: 'Missing Current Password'} )
      return
    }

    if (this.state.passwordNew === '') {
      this.setState({ loading: false, snackOpen: true, snackMsg: 'Missing New Password'} )
      return
    }

    // First test new passwords match
    const comp = this.state.passwordNew.localeCompare(this.state.passwordConfirm)
    if (comp !== 0) {
      this.setState({ loading: false, snackOpen: true, snackMsg: 'New passwords do not match.'} )
      return
    }
    try {
      this.setState({ loading: true })
      const result = await Auth.changePassword(this.state.user, this.state.passwordOld, this.state.passwordNew)
      console.log(`ChangePassword::onSubmitForm(): Result ${JSON.stringify(result, null, 2)}`) // eslint-disable-line

      this.setState({
        loading:          false,
        passwordConfirm:  '',
        passwordNew:      '',
        passwordOld:      '',
        snackMsg:         'Password Successfully Changed.',
        snackOpen:        true,
      })
    } catch (err) {
      const errMsg = err.message || err
      console.log(`ChangePassword::onSubmitForm(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({ error: errMsg, loading: false, snackMsg: errMsg, snackOpen: true })
    }
  }

  render() {

    const { classes } = this.props
    const { loading, snackMsg, snackOpen } = this.state

    return (
      <div className={classes.container}>
        <Header />
        <Paper className={classes.paper}>
          <AppBar
              className={classes.appBar}
              color="secondary"
              position="static"
          >
            <Typography
                color="inherit"
                variant="h6"
            >
              Change Password
            </Typography>
          </AppBar>

          <div className={classes.formContainer}>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="passwordOld">Current Password</InputLabel>
              <Input
                  id="passwordOld"
                  name="passwordOld"
                  onChange={this.handleChange}
                  type="password"
                  value={this.state.passwordOld}
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="passwordNew">New Password</InputLabel>
              <Input
                  id="passwordNew"
                  name="passwordNew"
                  onChange={this.handleChange}
                  type="password"
                  value={this.state.passwordNew}
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="passwordConfirm">Confirm Password</InputLabel>
              <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  onChange={this.handleChange}
                  type="password"
                  value={this.state.passwordConfirm}
              />
            </FormControl>

            <Button
                className={classes.submitButton}
                color="primary"
                disabled={loading}
                onClick={() => this.onSubmitForm()}
                variant="contained"
            >
              {loading ? 'Stand by...' : 'Submit New Password'}
            </Button>

          </div>
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

Profile.propTypes = {
  classes:  PropTypes.object.isRequired,
}

const styles =  theme => ({
  appBar: {
    padding: theme.spacing.unit * 1.5,
    paddingLeft: theme.spacing.unit * 3,
  },
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
  },
  paper: {
    margin:     'auto',
    marginTop:  theme.spacing.unit * 3,
    minWidth:   500,
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

export default withStyles(styles)(Profile)
