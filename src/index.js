import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory'
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

const httpLink = new HttpLink({ uri: config.BASE_URL })
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem('userToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const link = ApolloLink.from([
  authLink,
  errorLink,
  httpLink,
])

const defaultOptions = {
  watchQuery: {
    // fetchPolicy: 'cache-and-network',
    fetchPolicy: 'network-only',
    // fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    // fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    /*if (object.__typename === 'FuelSaleDetailedReport') {
      console.log('object: ', object)
    }*/
    switch (object.__typename) {
      case 'DipOverShort': return `${object.date}${object.stationID}`
      case 'Dip': return `${object.date}${object.stationTankID}`
      case 'FuelPrice': return `${object.date}${object.stationID}`
      case 'PropaneDeliver': return object.date
      case 'Station': return object.id
      case 'StationTank': return object.id
      default: return defaultDataIdFromObject(object) // fall back to default handling
    }
  },
})

const client = new ApolloClient({
  link,
  cache,
  queryDeduplication: true,
  defaultOptions,
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
