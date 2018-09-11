import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import errorReducer from './modules/Error/errorReducer'

const rootReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  errors: errorReducer,
})

export default rootReducer