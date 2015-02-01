var h = require('hyperscript')
var nicedate = require('nicedate')
var com = require('./')

var summaryOf = {
  init: function (msg) { return 'new source, '+msg.value.author },
  name: function (msg) { return msg.value.content.name },
  post: function (msg) { return msg.value.content.text },
  follow: function (msg) {
    if (msg.value.content.rel == 'follows')
      return 'TODO followed TODO'
    if (msg.value.content.rel == 'unfollows')
      return 'TODO unfollowed TODO'
  },
  pub: function (msg) {
    if (msg.value.content.address.host)
      return 'pub: '+msg.value.content.address.host+':'+(msg.value.content.address.port||2000)
    if (msg.value.content.address)
      return 'pub: '+msg.value.content.address
  }
}

module.exports = function (msg) {
  try {
    var text
    try { text = summaryOf[msg.value.content.type](msg) } catch (e) { console.log(msg, e)}
    if (!text) text = 'type: '+msg.value.content.type
    if (text.length > 60) {
      text = text.slice(0, 60) + '...'
    }

    return h('.message-summary', 
      h('div', h('a', { href: '/m/'+msg.key }, com.messageIcon(msg), text)),
      h('div', h('small', nicedate(new Date(msg.value.timestamp), true)))      
    )
  }
  catch (e) {
    console.error('Failed to render message summary', e, msg)
  }
}