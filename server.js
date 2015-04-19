var http = require('http')
var stack = require('stack')
var path = require('path')

var PORT = 8050
var LIVEBUILD = process.env.livebuild == 1
var ASSETS_PATH = path.join(__dirname, 'client')

http.createServer(stack(
  function (req, res, next) {
    // CSPs
    res.setHeader('Content-Security-Policy', 'default-src \'self\'; script-src \'self\' http://localhost:8008; connect-src \'self\' ws://localhost:8008 http://localhost:8008')
    next()
  },
  require('stack-assets-builder')({ enabled: LIVEBUILD, root: ASSETS_PATH }),
  require('stack-assets-static')({ root: ASSETS_PATH })
)).listen(PORT)
console.log('live build', (LIVEBUILD) ? 'enabled' : 'disabled', '(env livebuild='+process.env.livebuild+')')
console.log('listening on', PORT)