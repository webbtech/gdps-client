import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Switch, Route } from 'react-router'
import Amplify from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react'

import Admin from '../Admin/Admin'
import aws_exports from '../Auth/aws-exports'
import ChangePassword from '../Profile/ChangePassword'
import Dashboard from './Dashboard'
import Dips from '../Dips/Dips'
import Profile from '../Profile/Profile'
import Propane from '../Propane/Propane'
import Reports from '../Reports/Reports'
import withRoot from '../../withRoot'

import ConfirmSignIn from '../Auth/ConfirmSignIn'
import SignIn from '../Auth/SignIn'
import ForgotPassword from '../Auth/ForgotPassword'
import RequireNewPassword from '../Auth/RequireNewPassword'
import Errors from '../Error/ErrorContainer'


Amplify.configure(aws_exports)
const history = createHistory()


class Index extends Component {

  render() {

    if (this.props.authState !== 'signedIn') return null

    return (
        <ConnectedRouter history={history}>
          <div>
            <Errors />
            <Switch>
              <Route
                  component={Dashboard}
                  exact
                  path="/"
              />
              <Route
                  component={Dips}
                  path="/dips"
              />
              <Route
                  component={Reports}
                  path="/reports"
              />
              <Route
                  component={Propane}
                  path="/propane"
              />
              <Route
                  component={Admin}
                  path="/admin"
              />
              <Route
                  component={Profile}
                  path="/profile"
              />
              <Route
                  component={ChangePassword}
                  path="/change-password"
              />
            </Switch>
          </div>
        </ConnectedRouter>
    )
  }
}

Index.propTypes = {
  authState:  PropTypes.string,
}

class AppWithAuth extends Component { // eslint-disable-line react/no-multi-comp

  state = {
    user: '',
  }

  /*async componentWillMount() {
    const user = await Auth.currentAuthenticatedUser()
    if (user) {
      this.setState({user})
      console.log('user in componentDidMount: ', user)
    }
  }*/

  handleAuthStateChange(state) {
    console.log('state in handleAuthStateChange: ', state) // eslint-disable-line
    // if (state === 'signedIn') {
        // Do something when the user has signed-in
    // }
  }

  render(){
    // console.log('user in render: ', this.state)

    return (
      <div>
        <Authenticator
            hideDefault
            // onStateChange={this.handleAuthStateChange}
            theme={{}}
        >
          <Index />
          <SignIn/>
          <ConfirmSignIn/>
          <ForgotPassword/>
          <RequireNewPassword/>
        </Authenticator>
      </div>
    )
  }
}

export default withRoot(AppWithAuth)
