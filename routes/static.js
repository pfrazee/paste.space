var s = require('../lib/static')

module.exports = function (req, res, next) {
  // Static asset routes
  if (s.pathEnds(req, '.jpg'))        s.type(res, 'image/jpeg')
  else if (s.pathEnds(req, '.jpeg'))  s.type(res, 'image/jpeg')
  else if (s.pathEnds(req, '.gif'))   s.type(res, 'image/gif')
  else if (s.pathEnds(req, '.ico'))   s.type(res, 'image/x-icon');
  else if (s.pathEnds(req, '.png'))   s.type(res, 'image/png');
  else if (s.pathEnds(req, '.woff'))  s.type(res, 'application/x-font-woff')
  else if (s.pathEnds(req, '.woff2')) s.type(res, 'application/font-woff2')
  else if (s.pathEnds(req, '.js'))    s.type(res, 'application/javascript')
  else if (s.pathEnds(req, '.css'))   s.type(res, 'text/css')
  if (s.pathStarts(req, '/img/') || s.pathStarts(req, '/fonts/') || s.pathStarts(req, '/css/') || s.pathStarts(req, '/js/'))
    return s.serve(res, req.url)
  next()
}