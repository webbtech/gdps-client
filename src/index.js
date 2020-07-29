import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'

import registerServiceWorker from './registerServiceWorker'
import configureStore from './store/configureStore'

const LogRocketID = process.env.REACT_APP_LOGROCKET_ID
const SentryURL = process.env.REACT_APP_SENTRY_URL
const store = configureStore()
const rootEl = document.getElementById('root')

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(LogRocketID)
  Sentry.init({ dsn: SentryURL })
}

// see: https://blog.isquaredsoftware.com/2016/11/practical-redux-part-3-project-planning-and-setup/
// for explanation on below
let render = () => {
  // Dynamically import our main App component, and render it
  const Index = require('./modules/Index/Index').default // eslint-disable-line

  ReactDOM.render(
    <Provider store={store}>
      <Index />
    </Provider>,
    rootEl
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render

  // In development, we wrap the rendering function to catch errors,
  // and if something breaks, log the error and render it to the screen
  render = () => {
    try {
      renderApp()
    } catch (error) {
      console.error(error) // eslint-disable-line
      // renderError(error)
    }
  }

  // Whenever the App component file or one of its dependencies
  // is changed, re-import the updated component and re-render it
  module.hot.accept('./modules/Index/Index', () => {
    setTimeout(render)
  })
}

registerServiceWorker()
render()
