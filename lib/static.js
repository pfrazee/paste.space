var fs = require('fs')
var path = require('path')

exports.resolve = function (file) {
  return path.join(__dirname, '../client', file)
}
exports.pathStarts = function (req, v) {
  return req.url.indexOf(v) === 0
}
exports.pathEnds = function (req, v) {
  return req.url.indexOf(v) === (req.url.length - v.length)
}
exports.type = function  (res, t) { 
  res.setHeader('Content-Type', t)
}
exports.read = function (file) {
  return fs.createReadStream(exports.resolve(file))
}
exports.serve = function (res, file) {
  return exports.read(file).on('error', function () { 
    res.writeHead(404)
    res.end('Not found')
  }).pipe(res)
}