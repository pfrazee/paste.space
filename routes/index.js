var multicb = require('multicb')
var s = require('../lib/static')
var redis = require('../lib/redis')
var indexView = require('../views/pages/index')

module.exports = function (req, res, next) {

  // Homepage
  if (req.url == '/' || req.url == '/index.html') {
    return redis.lrange('msgs', -30, -1, function (err, keys) {
      if (err || !keys || !keys.length) {
        err && console.error(err)
        return next(null, [])
      }

      var done = multicb()
      keys.forEach(function (key) { redis.get('msg:'+key, done()) })
      done(next)

      function next (err, msgs) {
        if (err)
          console.error(err)

        s.type(res, 'text/html')
        res.writeHead(200)
        return res.end(indexView(msgs).outerHTML)
      }
    })
  }

  next()
}