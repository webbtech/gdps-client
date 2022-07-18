import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { ApolloProvider } from '@apollo/client'
import { Authenticator } from 'aws-amplify-react'
import { ConnectedRouter } from 'react-router-redux'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router'
import Amplify, { Auth } from 'aws-amplify'
import { createBrowserHistory } from 'history'
import Loadable from 'react-loadable'
import LogRocket from 'logrocket'

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider'

import { getTitle } from '../../utils/utils'
import { LOCAL_TOKEN_KEY } from '../../config/constants'
import awsExports from '../Auth/aws-exports'
import ChangePassword from '../Profile/ChangePassword'
import client from '../../apollo'
import Dashboard from './Dashboard'
import Dips from '../Dips/Dips.cntr'
import Download from '../Common/Download'
import Errors from '../Error/Error.cntr'
import ImportData from '../ImportData/ImportData'
import Profile from '../Profile/Profile'
import Propane from '../Propane/Propane'
import withRoot from '../../withRoot'

// Authentication components
import ConfirmSignIn from '../Auth/ConfirmSignIn'
import SignIn from '../Auth/SignIn'
import ForgotPassword from '../Auth/ForgotPassword'
import RequireNewPassword from '../Auth/RequireNewPassword'

Amplify.configure(awsExports)

const history = createBrowserHistory()

const Loading = () => <div>Loading...</div>

const Admin = Loadable({
  loader: () => import('../Admin/Admin'),
  loading: Loading,
})

const Reports = Loadable({
  loader: () => import('../Reports/Reports'),
  loading: Loading,
})


function Index({ authState }) {
  if (authState !== 'signedIn') return null
  console.log('client: ', client)

  return (
    <ApolloProvider client={client}>
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      <ConnectedRouter history={history}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
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
                exact
                path="/propane"
              />
              <Route
                component={Propane}
                path="/propane/:date"
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
        </MuiPickersUtilsProvider>
      </ConnectedRouter>
    </ApolloProvider>
  )
}
Index.propTypes = {
  authState: PropTypes.string,
}
Index.defaultProps = {
  authState: '',
}

function AppWithAuth() {
  useEffect(() => {
    let cancel = false
    const getAuthUser = async () => {
      let user
      try {
        user = await Auth.currentAuthenticatedUser()
      } catch (e) {
        console.error(e) // eslint-disable-line
      }
      if (cancel) return
      if (user) {
        const username = user.signInUserSession.idToken.payload['cognito:username']
        const { name } = user.signInUserSession.idToken.payload
        const storage = window.localStorage
        storage.setItem(LOCAL_TOKEN_KEY, user.signInUserSession.idToken.jwtToken)
        LogRocket.identify(username, {
          name,
          username,
        })
      }
    }
    getAuthUser()
    return () => {
      cancel = true
    }
  }, [])

  return (
    <div>
      <Authenticator
        hideDefault
      >
        <Index />
        <SignIn />
        <ConfirmSignIn />
        <ForgotPassword />
        <RequireNewPassword />
      </Authenticator>
    </div>
  )
}

export default withRoot(AppWithAuth)
