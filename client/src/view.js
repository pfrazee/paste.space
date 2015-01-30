var pull = require('pull-stream')
var h = require('hyperscript')

exports.posts = function (el, ssb) {
  el.innerHTML = ''
  pull(ssb.messagesByType({ type: 'paste.space/post', limit: 30 }), pull.drain(function (post) {
    el.appendChild(renderPost(post))
  }))
}

function renderPost (post) {
  try {
    var c = post.value.content
    return h('h3', c.title)
  }
  catch (e) {
    console.warn('Bad paste.space/post', e, post)
  }
}

exports.form = function (el, onsubmit) {
  el.innerHTML = ''
  el.appendChild(h('form', { onsubmit: onsubmit },
    h('p', h('label', 'Filename: ', h('input', { type: 'text', name: 'filename' }))),
    h('p', h('label', 'Content: ', h('textarea', { name: 'data', rows: 10 }))),
    h('p', h('button', { type: 'submit' }, 'Post'))
  ))
}