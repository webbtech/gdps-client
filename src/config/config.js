// const localhostIP = '10.0.1.9'
const localhostIP = '127.0.0.1'

const conf = {
  development: {
    BASE_URL: `http://${localhostIP}:3120/graphql`,
  },
  production: {
    BASE_URL: '/graphql',
  },
}
export const config = conf[process.env.NODE_ENV]