var multicb = require('multicb')
var s = require('../lib/static')
var redis = require('../lib/redis')
var messageView = require('../views/pages/message')

module.exports = function (req, res, next) {

  // Homepage
  if (s.pathStarts(req, '/m/')) {
    var key = req.url.slice(3)
    return redis.get('msg:'+key, function (err, msg) {
      if (err) {
        err && console.error(err)
        res.writeHead(500)
        return res.end('Internal Error')
      }
      
      try { msg = JSON.parse(msg) }
      catch (e) {
        console.error('Failed to parse message from redis', key, msg, e)
        msg = null
      }

      res.writeHead(200)
      res.end(messageView(msg || { key: key, value: null }).outerHTML)
    })
  }

  next()
}