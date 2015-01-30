var h = require('hyperscript')
var com = require('../com')

module.exports = function (msgs) {
  return h('html',
    h('head', h('title', 'paste.space')),
    h('body',
      h('p', h('button#loginbtn', 'Login'), ' ', h('button#logoutbtn', 'Logout')),
      h('h2', 'Uploaded to paste.space'),
      h('div', msgs.map(com.messageSummary)),
      h('h2', 'On your network'),
      h('#postsdiv', h('em', 'Login to see your network\'s posts')),
      h('script', { src: 'js/index.js' })
    )
  )
}