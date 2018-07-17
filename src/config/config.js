// const localhostIP = '10.0.1.9'
const localhostIP = '127.0.0.1'
const liveURI = 'https://ajwx7ox6hj.execute-api.ca-central-1.amazonaws.com/Prod/'

const conf = {
  development: {
    // BASE_URL: `http://${localhostIP}:3000/graphql`,
    BASE_URL: `http://${localhostIP}:4000/`,
    // BASE_URL: liveURI,
  },
  production: {
    BASE_URL: liveURI,
  },
}
export const config = conf[process.env.NODE_ENV]