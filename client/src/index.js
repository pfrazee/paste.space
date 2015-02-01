var pull = require('pull-stream')
var sbot = require('./lib/scuttlebot')
var dec = require('./decorators')
var com = require('../../views/com')

var postsDiv = document.getElementById('postsdiv')
dec.login(document.getElementById('loginbtn'), document.getElementById('logoutbtn'))

sbot.on('ready', function() {
  // :TODO: this should include a challenge for the server to sign, proving ownership of the keypair
  sbot.ssb.whoami(function(err, id) {
    console.log('whoami', err, id)
  })

  postsDiv.innerHTML = ''
  pull(sbot.ssb.createLogStream({ limit: 30, reverse: true, live: true }), pull.drain(function (post) {
    postsDiv.insertBefore(com.messageSummary(post), postsDiv.firstChild)
  }))
})