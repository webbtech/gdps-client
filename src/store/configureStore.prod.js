// import logger from 'redux-logger'
// import { composeWithDevTools } from 'redux-devtools-extension'

import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers'

const history = createHistory()
const middleware = routerMiddleware(history)

export default function configureStore(preloadedState={}) {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(middleware)
  )
  return store
}