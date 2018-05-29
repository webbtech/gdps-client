import React, { Component } from 'react'

import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Switch, Route } from 'react-router'

import Dashboard from './Dashboard'
import Admin from '../Admin/Admin'
import Dips from '../Dips/Dips'
import Reports from '../Reports/Reports'
import Propane from '../Propane/Propane'
import withRoot from '../../withRoot'

const history = createHistory()
const middleware = routerMiddleware(history)
const store = createStore(
  combineReducers({
    router: routerReducer,
  }),
  applyMiddleware(middleware)
)

class Index extends Component {
  render() {
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
                exact
                path="/admin"
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default withRoot(Index)
