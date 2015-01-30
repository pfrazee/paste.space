var http = require('http')
var fs = require('fs')
var path = require('path')

var PORT = 8050

function onRequest(req, res) {
  function resolve(file) { return path.join(__dirname, file) }
  function pathStarts(v) { return req.url.indexOf(v) === 0; }
  function pathEnds(v) { return req.url.indexOf(v) === (req.url.length - v.length); }
  function type (t) { res.setHeader('Content-Type', t) }
  function read(file) { return fs.createReadStream(resolve(file)); }
  function serve(file) { return read(file).on('error', serve404).pipe(res) }
  function serve404() { res.writeHead(404); res.end('Not found'); }

  res.setHeader('Content-Security-Policy', 'default-src \'self\'; connect-src \'self\' ws://localhost:2000 http://localhost:2000')

  // Homepage
  if (req.url == '/' || req.url == '/index.html') {
    type('text/html')
    return serve('html/index.html')
  }

  // Auth page
  if (req.url.indexOf('/auth.html') === 0 && req.method == 'GET') {
    type('text/html')
    return serve('html/auth.html')
  }

  // Static asset routes
  if (pathEnds('.jpg'))        type('image/jpeg')
  else if (pathEnds('.jpeg'))  type('image/jpeg')
  else if (pathEnds('.gif'))   type('image/gif')
  else if (pathEnds('.ico'))   type('image/x-icon');
  else if (pathEnds('.png'))   type('image/png');
  else if (pathEnds('.woff'))  type('application/x-font-woff')
  else if (pathEnds('.woff2')) type('application/font-woff2')
  else if (pathEnds('.js'))    type('application/javascript')
  else if (pathEnds('.css'))   type('text/css')
  if (pathStarts('/img/') || pathStarts('/fonts/') || pathStarts('/css/') || pathStarts('/js/'))
    return serve(req.url)
  serve404()
}

http.createServer(onRequest).listen(PORT)
console.log('listening on', PORT)