var SSBClient = require('ssb-client')
var SSBKeys = require('ssb-keys')
var pull = require('pull-stream')
var h = require('hyperscript')
 
var ssb, feed
var user = { 
  keys: null,
  name: '',
  master: null
}
setup()

function setup () {
  // setup gui
  $('.add-form-show').addEventListener('click', onClickAddformshow)
  $('.add-form').addEventListener('submit', onSubmitAddform)
  $('.add-form').addEventListener('reset', onResetAddform)

  // load keys
  try {
    user.keys = JSON.parse(localStorage.keys)
  } catch (e) {
    user.keys = SSBKeys.generate()
    localStorage.keys = JSON.stringify(user.keys)
  }
   
  // connect to sbot
  ssb = SSBClient({ host: 'localhost' })
  ssb.connect().auth(SSBKeys.createAuth(user.keys), function (err) {
    if(err)
      return showerr('Failed to authenticate with scuttlebot', err)
    feed = ssb.createFeed(user.keys)
    loaduser()
    list()
  })
}

function loaduser () {
  // get master feed id
  ssb.whoami(function (err, master) {
    if (err)
      return showerr('Failed to get master user info', err)

    // pull user history
    pull(ssb.createHistoryStream({ id: user.keys.id }), pull.drain(
      function (msg) {
        var c = msg.value.content

        // alias
        if (c.type == 'contact' && c.alias == 'primary' && c.contact.feed) {
          user.master = c.contact.feed
        }
        // self name
        if (c.type == 'contact' && c.name && c.contact.feed == user.keys.id) {
          user.name = c.name
        }
      },
      function (err) {
        if(err)
          return showerr('Failed to load user', err)

        // need to set alias?
        if (!user.master) {
          feed.add({ type: 'contact', alias: 'primary', contact: { feed: master.id }}, function (err, msg) {
            if (err)
              return showerr('Failed to alias this feed to your master feed', err)
            console.log('Created alias to', master.id, msg)
          })
        }
        // need to set name?
        if (!user.name) {
          feed.add({ type: 'contact', name: 'paste.space', contact: { feed: user.keys.id }}, function (err, msg) {
            if (err)
              return showerr('Failed to set the feed\'s name', err)
            console.log('Set feed name', msg)
          })
        }
      }
    ))
  })
}

function list () {
  pull(ssb.messagesByType({ type: 'paste.space/item', reverse: true }), pull.drain(function (msg) {
    var c = msg.value.content

    // validate
    if (typeof c.title != 'string' || !c.title.trim())
      return console.warn('Skipping invalid paste.space/item - no .title', msg)
    if (typeof c.text != 'string' || !c.text.trim())
      return console.warn('Skipping invalid paste.space/item - no .text', msg)

    // render
    var textel = h('pre', c.text)
    $('.list').appendChild(h('div',
      h('h2', { id: msg.key }, c.title, ' ', h('small', h('a', { href: '#'+msg.key }, 'link'))),
      textel))

    // check for extensions
    pull(ssb.messagesLinkedToMessage({ id: msg.key, rel: 'extends', keys: true }), pull.drain(function (msg2) {
      var c2 = msg2.value.content

      // validate
      if (msg.value.author != msg2.value.author)
        return // must be same author
      if (c2.type != 'paste.space/more')
        return // wrong type
      if (typeof c2.text != 'string' || !c2.text.trim())
        return console.warn('Skipping invalid paste.space/more - no .text', msg)

      // render
      if (textel.textContent)
        textel.textContent += c2.text
      else if (texel.innerText)
        textel.innerText += c2.text
    }))
  }))
}

function onClickAddformshow (e) {
  e.preventDefault()
  $('.add-form').classList.add('visible')
}

function onSubmitAddform (e) {
  e.preventDefault()
  var form = $('.add-form')
  var title = form.title.value
  var text = form.text.value

  // validate
  var errors = ''
  if (!title.trim()) {
    form.title.classList.add('error')
    errors += 'Title is required.\n'
  } else {
    form.title.classList.remove('error')
  }
  if (!text.trim()) {
    form.text.classList.add('error')
    errors += 'Text is required.\n'
  } else if (text.length > 1e6) {
    form.text.classList.add('error')
    errors += 'Text must be less than 1mb.\n'      
  } else {
    form.text.classList.remove('error')
  }
  if (errors) {
    $('.add-form-errors').innerHTML = errors
    return
  }

  // sanity check
  if (!feed) {
    $('.add-form-errors').innerHTML = 'Unable to post - not connected to scuttlebot.'
    return
  }

  // post
  var cursor = 600 - title.length
  var firstText = text.slice(0, cursor)
  feed.add({ type: 'paste.space/item', title: title, text: firstText }, function (err, itemmsg) {
    if (err)
      return showerr('Failed to publish.', err)

    addRemaining()
    function addRemaining () {
      if (cursor >= text.length) {
        // done
        $('.add-form').reset()
        return
      }

      var remainingText = text.slice(cursor, cursor+500)
      cursor += 500
      feed.add({ type: 'paste.space/more', text: remainingText, extends: { msg: itemmsg.key } }, function (err) {
        if (err)
          return showerr('Failed to publish full text.', err)
        addRemaining()
      })
    }
  })
}

function onResetAddform (e) {
  $('.add-form').classList.remove('visible')
  $$('.add-form .error').forEach(function (el) { el.classList.remove('error') })
  $('.add-form-errors').innerHTML = ''
}

function showerr (msg, err) {
  // :TODO: non crummy alert
  alert(msg)
  if (err)
    console.error(msg, err)
}

function $ (sel) {
  return document.querySelector(sel)
}
function $$ (sel) {
  return Array.prototype.slice.call(document.querySelectorAll(sel))
}