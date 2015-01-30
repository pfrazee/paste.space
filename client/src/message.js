var pull = require('pull-stream')
var sbot = require('./lib/scuttlebot')
var dec = require('./decorators')
var com = require('../../views/com')

var messageDiv = document.getElementById('message')
var key = window.location.pathname.slice(3)
var isPublished = (messageDiv.childNodes.length !== 0)

// setup ui
dec.login(document.getElementById('loginbtn'), document.getElementById('logoutbtn'))
var publisher = dec.publisher(document.getElementById('publishbtn'))
publisher.setPublished(isPublished)

// sbot interactions
sbot.on('ready', function() {
  if (!isPublished) {
    // not found on server, try local
    sbot.ssb.get(key, function (err, value) {
      var msg = { key: key, value: value }
      messageDiv.appendChild(com.message(msg))
      publisher.setAvailable(true, msg)
    })
  }
})