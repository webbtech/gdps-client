import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Switch, Route } from 'react-router'
import Amplify from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react'

import Admin from '../Admin/Admin'
import aws_exports from '../Auth/aws-exports'
import ChangePassword from '../Profile/ChangePassword'
import Dashboard from './Dashboard'
import Download from '../Common/Download'
import Dips from '../Dips/Dips.cont'
import ImportData from '../ImportData/ImportData'
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
                  exact
                  path="/dips"
              />
              <Route
                  component={Dips}
                  path="/dips/:date/:stationID"
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
                  component={ImportData}
                  path="/import-data"
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
              <Route
                  component={Download}
                  path="/download"
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

  async componentWillMount() {
    const user = await Auth.currentAuthenticatedUser()
    if (user) {
      // this.setState({user})
      // console.log('fetching user from Auth')
      const storage = window.localStorage
      // console.log('user in componentDidMount: ', user.signInUserSession.accessToken.jwtToken)
      storage.setItem('userToken', user.signInUserSession.accessToken.jwtToken)
    }
  }

  handleAuthStateChange(state) {
    // console.log('state in handleAuthStateChange: ', state) // eslint-disable-line
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
            onStateChange={this.handleAuthStateChange}
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
