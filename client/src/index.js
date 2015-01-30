var sbot = require('./lib/scuttlebot')
var view = require('./view')

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
  view.posts(postsDiv, sbot.ssb)
  view.form(formDiv, function (e) {
    e.preventDefault()
    var msg = { type: 'paste.space/post', title: e.target.title.value }
    if (!msg.title)
      return
    sbot.ssb.add(msg, function (err) {
      if (err)
        console.error(err)
      e.target.reset()
      view.posts(postsDiv, sbot.ssb)
    })
  })
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