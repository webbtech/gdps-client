import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import Index from './modules/Index/Index'

// import gql from 'graphql-tag'
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
})

const App = () => (
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>
)

/*client
  .query({
    query: gql`
    {
      stations {
        ID,
        Name
      }
    }
`
})
.then(result => console.log(result))*/

// ReactDOM.render(<Index />, document.getElementById('root'))
ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
