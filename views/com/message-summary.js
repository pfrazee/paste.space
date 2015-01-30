var h = require('hyperscript')
var nicedate = require('nicedate')

module.exports = function (msg) {
  try {
    var text = msg.value.content.text
    if (text.length > 60) {
      text = text.slice(0, 60) + '...'
    }

    return h('p.message-summary', 
      h('small', nicedate(new Date(msg.value.timestamp), true)), h('br'),
      h('a', { href: '/m/'+msg.key }, text)
    )
  }
  catch (e) {
    console.error('Failed to render message summary', e, msg)
  }
}