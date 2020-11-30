import LogRocket from 'logrocket'

import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import rootReducer from '../reducers'

const history = createBrowserHistory()
const middleware = routerMiddleware(history)

export default function configureStore(preloadedState = {}) {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(LogRocket.reduxMiddleware(), middleware)
  )
  return store
}
