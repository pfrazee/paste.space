var h = require('hyperscript')
var nicedate = require('nicedate')

module.exports = function (msg) {
  try {
    return h('.message', 
      h('div', h('small', nicedate(new Date(msg.value.timestamp), true))),
      h('pre', JSON.stringify(msg.value, null, 2))
    )
  }
  catch (e) {
    console.error('Failed to render message summary', e, msg)
  }
}