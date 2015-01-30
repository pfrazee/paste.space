var pull = require('pull-stream')
var sbot = require('./lib/scuttlebot')
var com = require('../../views/com')

var loginBtn = document.getElementById('loginbtn')
var logoutBtn = document.getElementById('logoutbtn')
var postsDiv = document.getElementById('postsdiv')
var formDiv = document.getElementById('formdiv')

sbot.on('ready', function() {
  loginBtn.setAttribute('disabled', true)
  logoutBtn.removeAttribute('disabled')

  // :TODO: this should include a challenge for the server to sign, proving ownership of the keypair
  sbot.ssb.whoami(function(err, id) {
    console.log('whoami', err, id)
  })

  postsDiv.innerHTML = ''
  pull(sbot.ssb.messagesByType({ type: 'post', limit: 30, reverse: true }), pull.drain(function (post) {
    postsDiv.appendChild(com.messageSummary(post))
  }))
})
sbot.on('error', function() {
  loginBtn.removeAttribute('disabled')
  logoutBtn.setAttribute('disabled', true)
})

loginBtn.onclick = function(e){
  e.preventDefault()
  sbot.login()
}
logoutBtn.onclick = function(e){
  e.preventDefault()
  sbot.logout()
  loginBtn.removeAttribute('disabled')
  logoutBtn.setAttribute('disabled', true)
}