import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'

import errorReducer from './modules/Error/errorReducer'

const rootReducer = combineReducers({
  router: routerReducer,
  errors: errorReducer,
})

export default rootReducer