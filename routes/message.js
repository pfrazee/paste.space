var multicb = require('multicb')
var s = require('../lib/static')
var redis = require('../lib/redis')

module.exports = function (req, res, next) {

  // Homepage
  if (s.pathStarts(req, '/m')) {
    var key = req.url.slice(3)
    return redis.multi()
      .get('paste:'+key)
      .get('paste-blob:'+key)
      .exec(function (err, data) {
        if (err) {
          err && console.error(err)
          res.writeHead(500)
          return res.end('Internal Error')
        }
        
        console.log(data)
        // :TODO:

        res.writeHead(200)
        res.end(JSON.stringify(data))
      })
  }

  next()
}