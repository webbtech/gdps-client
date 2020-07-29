import { createBrowserHistory } from 'history'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import LogRocket from 'logrocket'

import rootReducer from '../reducers'

const history = createBrowserHistory()
const middleware = routerMiddleware(history)

export default function configureStore(preloadedState = {}) {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(LogRocket.reduxMiddleware(), middleware, logger))
  )
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(rootReducer))
  }

  return store
}
