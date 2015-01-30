var multicb = require('multicb')
var s = require('../lib/static')
var redis = require('../lib/redis')

module.exports = function (req, res, next) {

  // Homepage
  if (req.url == '/' || req.url == '/index.html') {
    return redis.lrange('pastes', -30, -1, function (err, keys) {
      if (err || !keys || !keys.length) {
        err && console.error(err)
        return next(null, [])
      }
      
      var done = multicb()
      keys.forEach(function (key) { redis.get('paste:'+key, done()) })
      done(next)

      function next (err, pastes) {
        if (err)
          console.error(err)

        console.log(pastes)
        // :TODO:

        s.type(res, 'text/html')
        return s.serve(res, 'html/index.html')
      }
    })
  }

  next()
}