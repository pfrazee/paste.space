var sbot = require('../lib/scuttlebot')

module.exports = function (loginBtn, logoutBtn) {
  sbot.on('ready', function() {
    loginBtn.setAttribute('disabled', true)
    logoutBtn.removeAttribute('disabled')
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
}