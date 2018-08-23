console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod')
} else {
  // const env = getEnv()
  // if (env === 'development') {
    module.exports = require('./configureStore.dev')
  // } else if (env === 'stage') {
    // module.exports = require('./configureStore.stg')
  // }
}

