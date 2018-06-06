import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import { Auth } from 'aws-amplify'

import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Switch, Route } from 'react-router'
import Amplify from 'aws-amplify'
// import { Authenticator, ConfirmSignIn, SignIn, ForgotPassword, RequireNewPassword } from 'aws-amplify-react'
import { Authenticator } from 'aws-amplify-react'
// import { AmplifyTheme } from 'aws-amplify-react'

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

const history = createHistory()
const middleware = routerMiddleware(history)
const store = createStore(
  combineReducers({
    router: routerReducer,
  }),
  applyMiddleware(middleware)
)

Amplify.configure(aws_exports)


class Index extends Component {

  render() {

    if (this.props.authState !== 'signedIn') return null

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
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
        </ConnectedRouter>
      </Provider>
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
