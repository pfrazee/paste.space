var u = require('../lib/util')

module.exports = function (btn) {
  var available = false, published = false, msg

  btn.onclick = function (e) {
    e.preventDefault()
    u.postJson('/store', { msg: msg }, function (err) {
      if (err) {
        console.error(err)
        // :TODO:
      } else {
        published = true
        render()
      }
    })
  }

  function render() {
    if (published) {
      btn.setAttribute('disabled', true)
      btn.innerText = 'Published'
    } else if (available && msg) {
      btn.removeAttribute('disabled')
      btn.innerText = 'Publish'
    } else {
      btn.setAttribute('disabled', true)
      btn.innerText = 'Cannot publish'      
    }
  }

  return {
    setAvailable: function (v, _msg) {
      available = v
      msg = _msg
      render()
    },
    setPublished: function (v) {
      published = v
      render()
    }
  }
}