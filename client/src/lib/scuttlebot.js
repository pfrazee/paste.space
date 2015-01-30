var muxrpc = require('muxrpc')
var Serializer = require('pull-serializer')
var chan = require('ssb-channel')
var auth = require('ssb-domain-auth')
var events = require('events')

var sbot = module.exports = new events.EventEmitter()

var ssb = sbot.ssb = muxrpc(require('./ssb-manifest'), false, serialize)()
var ssbchan = chan.connect(ssb, 'localhost')
ssbchan.on('connect', function() {
  console.log('Connected')
  auth.getToken('localhost', function(err, token) {
    if (err) return ssbchan.close(), console.log('Token fetch failed', err)
    ssb.auth(token, function(err) {
      if (err) return ssbchan.close(), console.log('Auth failed')
      sbot.emit('ready')
    })
  })
})
ssbchan.on('reconnecting', function () {
  console.log('Reconnecting')
  sbot.emit('reconnecting')
})
ssbchan.on('error', function (err) {
  console.log('Connection failed')
  sbot.emit('error', err)
})

sbot.login = function () {
  auth.openAuthPopup('localhost', {
    title: 'paste.space',
    perms: ['whoami', 'add', 'messagesByType', 'createLogStream']
  }, function(err, granted) {
    if (granted)
      ssbchan.reconnect({ wait: 0 })
  })
}
sbot.logout = function () {
  auth.deauth('localhost')
  sbot.chan.close()
}

function serialize (stream) {
  return Serializer(stream, JSON, {split: '\n\n'})
}