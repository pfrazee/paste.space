var jsonBody = require('json-body')
var s = require('../lib/static')
var redis = require('../lib/redis')

module.exports = function (req, res, next) {

  // Store a paste
  if (req.url == '/store' && req.method == 'POST') {
    return jsonBody(req, function (err, body) {
      if (err) {
        console.error('Error parsing json body', err)
        res.writeHead(400)
        return res.end(err.toString())
      }

      var err = validate(body)
      if (err) {
        res.writeHead(422)
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(err))
      }

      redis.multi()
        .rpush('msgs',            body.msg.key)
        .set('msg:'+body.msg.key, JSON.stringify(body.msg))
        .exec(function (err) {
          if (err) {
            console.error(err)
            res.writeHead(500)
            return res.end(err.toString())
          }
          res.writeHead(204)
          res.end()
        })
    })
  }

  next()
}

function validate (body) {
  return false
}