var h = require('hyperscript')
var com = require('../com')

module.exports = function (msg) {
  return h('html',
    h('head',
      h('title', 'paste.space - '+msg.key),
      h('link', { rel: 'stylesheet', href: '/css/index.css' }),
      h('meta', { charset: 'utf8' })
    ),
    h('body',
      h('h1', h('a', { href: '/' }, 'paste.space')),
      h('p', h('button#loginbtn', 'Login'), ' ', h('button#logoutbtn', 'Logout')),
      h('#message', com.message(msg)),
      h('button#publishbtn', 'Publish'),
      h('script', { src: '/js/message.js' })
    )
  )
}