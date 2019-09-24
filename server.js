// server.js
// where your node app starts

var pathtoregexp = require('path-to-regexp')
// init project
var express = require('express')
var app = express()
// const regexData = '([12]d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]d|3[01]))'
const regexp = pathtoregexp('/api/timestamp/:id')

function isValidDate (d) {
  return d instanceof Date && !isNaN(d)
}
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors')
app.use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.get('/api/whoami', function (req, res) {
  // console.debug({ params: req.rawHeaders }, 'Hello there %s', 'foo')
  res.json({
    greeting: 'hello API',
    request: req.rawHeaders,
    ip: req.ip,
    language: req.headers['language'] || 'en-us',
    software: req.headers['user-agent'] || 'unset'
  })
})

app.get(regexp, function (req, res) {
  const date = req.params['0']
  var newDate = null
  if (req.params['0'] && req.params['0'].length > 0) {
    newDate = new Date(date)
    if (!isValidDate(newDate)) {
      newDate = new Date(parseInt(date))
      if (!isValidDate(newDate)) {
        res.json({ error: 'Invalid Date' })
      } else {
        res.json({ unix: newDate.getTime(), utc: newDate.toUTCString() })
      }
      // console.log('parseint', parseInt(req.params['0']))
      // res.json({ error: 'Invalid Date' })
    } else {
      res.json({ unix: newDate.getTime(), utc: newDate.toUTCString() })
    }
  } else {
    console.log('is blank')
    newDate = new Date()
    res.json({ unix: newDate.getTime(), utc: newDate.toUTCString() })
  }
})

// listen for requests :)
var listener = app.listen(50000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
