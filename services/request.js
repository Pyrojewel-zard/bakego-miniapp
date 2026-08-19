const env = require('../config/env')

function getToken() {
  return wx.getStorageSync(env.TOKEN_KEY) || ''
}

function setToken(token) {
  if (token) wx.setStorageSync(env.TOKEN_KEY, token)
  else wx.removeStorageSync(env.TOKEN_KEY)
}

function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const data = options.data || {}
  const login = options.login !== false
  const token = getToken()

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${env.YSHOP_BASE_URL}${path}`,
      method,
      data,
      timeout: env.REQUEST_TIMEOUT,
      header: {
        'content-type': 'application/json',
        ...(login && token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success(res) {
        const body = res.data || {}
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${body.msg || 'request failed'}`))
          return
        }
        if (body.code !== 0) {
          const err = new Error(body.msg || `API code ${body.code}`)
          err.code = body.code
          reject(err)
          return
        }
        resolve(body.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = { request, getToken, setToken }
