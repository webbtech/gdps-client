import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
// import { ApolloProvider } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

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
    fetchPolicy: 'cache-first',
    // fetchPolicy: 'cache-and-network',
    // fetchPolicy: 'network-only',
    // fetchPolicy: 'no-cache',
    // errorPolicy: 'ignore',
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

export default client