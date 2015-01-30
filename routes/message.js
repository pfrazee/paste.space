var multicb = require('multicb')
var s = require('../lib/static')
var redis = require('../lib/redis')

module.exports = function (req, res, next) {

  // Homepage
  if (s.pathStarts(req, '/m')) {
    var key = req.url.slice(3)
    return redis.get('msg:'+key, function (err, msg) {
      if (err) {
        err && console.error(err)
        res.writeHead(500)
        return res.end('Internal Error')
      }
      
      console.log(msg)
      // :TODO:

      res.writeHead(200)
      res.end(JSON.stringify(msg))
    })
  }

  next()
}