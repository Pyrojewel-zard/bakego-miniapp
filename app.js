const env = require('./config/env')
const mock = require('./data/mock')

App({
  globalData: {
    apiMode: env.API_MODE,
    mode: 'delivery',
    store: { ...mock.store },
    user: { ...mock.user }
  }
})
