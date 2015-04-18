var SSBClient = require('ssb-client')
var SSBKeys = require('ssb-keys')
var pull = require('pull-stream')
 
var ssb, feed
var user = { 
  keys: null,
  name: '',
  master: null
}
setup()

function setup () {
  // load keys
  try {
    user.keys = JSON.parse(localStorage.keys)
  } catch (e) {
    user.keys = SSBKeys.generate()
    localStorage.keys = JSON.stringify(user.keys)
  }
   
  // connect
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
  pull(ssb.messagesByType({ type: 'paste.space/item' }), pull.drain(function (msg) {
    document.body.innerHTML += '<pre>'+JSON.stringify(msg, 0, 4)+'</pre>'
  }))
}

function showerr (msg, err) {
  // :TODO: non crummy alert
  alert(msg)
  if (err)
    console.error(msg, err)
}