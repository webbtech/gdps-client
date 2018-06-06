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
    email:      '',
    error:      '',
    loading:    false,
    name:       '',
    password:   '',
    phone:      '',
    snackMsg:   '',
    snackOpen:  false,
    user:       {},
    username: '',
  }

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(
        (result) => {
          const user = result.attributes
          this.setState({
            loading:  false,
            email:    user.email,
            name:     user.name,
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

    let attributes = {
      email: this.state.email,
      name: this.state.name,
      // username: this.state.username,
    }
    try {
      this.setState({ loading: true })
      const result = await Auth.updateUserAttributes(this.state.user, attributes)
      console.log(`Profile::onSubmitForm(): Result ${JSON.stringify(result, null, 2)}`) // eslint-disable-line
      this.setState({ loading: false, snackMsg: 'Profile successfully updated.', snackOpen: true })
    } catch (err) {
      const errMsg = err.message || err
      console.log(`ForgotPassword::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`) // eslint-disable-line
      this.setState({ error: errMsg, loading: false, snackMsg: errMsg, snackOpen: true })
    }
  }

  render() {

    const { classes } = this.props
    const { loading, snackMsg, snackOpen, user } = this.state

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
                variant="title"
            >
              {user.name} Profile
            </Typography>
          </AppBar>

          <div className={classes.formContainer}>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                  id="name"
                  name="name"
                  onChange={this.handleChange}
                  value={this.state.name}
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                  id="email"
                  name="email"
                  onChange={this.handleChange}
                  type="email"
                  value={this.state.email}
              />
            </FormControl>

            <Button
                className={classes.submitButton}
                color="primary"
                disabled={loading}
                onClick={() => this.onSubmitForm()}
                variant="raised"
            >
              {loading ? 'Stand by...' : 'Update Profile'}
            </Button>

            <Button
                className={classes.additionalButton}
                onClick={() => this.props.history.push('/change-password')}
                size="small"
            >
              <Typography
                  color="inherit"
                  variant="body1"
              >
                Change Password
              </Typography>
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
  history:  PropTypes.object.isRequired,
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
  additionalButton: {
    margin:     theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginTop:  0,
    width:      theme.spacing.unit * 20,
    padding:    0,
  },
})

export default withStyles(styles)(Profile)
