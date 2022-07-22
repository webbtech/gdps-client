import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  defaultDataIdFromObject,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import * as Sentry from '@sentry/react'

import config from './config/config'
import { LOCAL_TOKEN_KEY } from './config/constants'

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      const err = `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`
      Sentry.captureException(err)
      console.log(err) // eslint-disable-line
      return err
    })
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`) // eslint-disable-line
    Sentry.captureException(networkError)
  }
})
const httpLink = new HttpLink({ uri: config.BASE_URL })
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem(LOCAL_TOKEN_KEY)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token || '',
    },
  }
})

const link = from([
  authLink,
  errorLink,
  httpLink,
])

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-first',
    // fetchPolicy: 'cache-and-network',
    // fetchPolicy: 'network-only',
    // fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'cache-first',
    // fetchPolicy: 'cache-and-network',
    // fetchPolicy: 'network-only',
    // fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    // if (object.__typename === 'FuelSaleDetailedReport') {
    //   console.log('object: ', object)
    // }
    switch (object.__typename) { // eslint-disable-line
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

export default client
