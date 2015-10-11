var http = require('http')
  , port = process.env.PORT || 1337

console.log('Starting on port %s', port)

http.createServer(function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')

  console.log(req.url, req.headers)

}).listen(process.env.PORT || 1337, '127.0.0.1')