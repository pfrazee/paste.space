var h = require('hyperscript')

var iconOf = {
  init: function (msg) { return 'feed_add' },
  name: function (msg) { return 'define_name' },
  post: function (msg) { return 'comment' },
  follow: function (msg) {
    if (msg.value.content.rel == 'follows')
      return 'mark_to_download'
    if (msg.value.content.rel == 'unfollows')
      return 'unmark_to_download'
  },
  pub: function (msg) { return 'server_information' }
}

var default_icon = 'emotion_question'

module.exports = function (msg) {
  var src
  try { src = iconOf[msg.value.content.type](msg) } catch (e) {}
  return h('img', { src: path32((src || default_icon)+'.png') })
}

function path32(s) {
  return '/img/fatcow-hosting-icons-3.9.2/FatCow_Icons32x32/'+s
}