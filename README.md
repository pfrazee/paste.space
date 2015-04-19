# paste.space

post text dumps (like gists) on ssb

## setup

client: install [scuttlebot](https://github.com/ssbc/scuttlebot) on your device, then navigate to your paste.space server, or to [https://paste.space](https://paste.space).

server: `node server.js` at an IP which can be reached by your clients

## development

run the server as `livebuilds=1 node server.js` to get live-building of the js and less
you'll need to `npm install -d` first

when ready to push, run
```
browserify -o client/js/home.js client/src/home.js
lessc client/less/home.less client/css/home.css
```