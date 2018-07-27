// const localhostIP = '10.0.1.9'
// const localhostIP = '127.0.0.1'

const liveURI = 'https://fqhx4fm4d8.execute-api.ca-central-1.amazonaws.com/Prod/graphql'
// const liveURI = 'http://127.0.0.1:3000/graphql'
// const liveURI = 'http://127.0.0.1:4000/'

const conf = {
  development: {
    // BASE_URL: `http://${localhostIP}:3000/graphql`,
    // BASE_URL: `http://${localhostIP}:4000/`,
    BASE_URL: liveURI,
  },
  production: {
    BASE_URL: liveURI,
  },
}
export const config = conf[process.env.NODE_ENV]