import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { Provider } from 'react-redux'

import registerServiceWorker from './registerServiceWorker'
import configureStore from './store/configureStore'

import { config } from './config/config'

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log( // eslint-disable-line
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`,
      )
    )
  }
  if (networkError) console.log(`[Network error]: ${networkError}`) // eslint-disable-line
})

// const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })
const httpLink = new HttpLink({ uri: config.BASE_URL })

const link = ApolloLink.from([
  errorLink,
  httpLink,
])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  queryDeduplication: true,
})

const store = configureStore()
const rootEl = document.getElementById('root')


// see: https://blog.isquaredsoftware.com/2016/11/practical-redux-part-3-project-planning-and-setup/
// for explanation on below
let render = () => {
  // Dynamically import our main App component, and render it
  const Index = require('./modules/Index/Index').default

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Index />
      </Provider>
    </ApolloProvider>,
    rootEl
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  /*const renderError = (error) => {
    const RedBox = require('redbox-react').default
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl,
    )
  }*/

  // In development, we wrap the rendering function to catch errors,
  // and if something breaks, log the error and render it to the screen
  render = () => {
    try {
      renderApp()
    }
    catch(error) {
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
