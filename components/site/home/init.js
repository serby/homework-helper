module.exports = initApi

var createController = require('./controllers/controller')

function initApi () {
  return { home: init }
}

function init (serviceLocator, done) {
  createController(serviceLocator)
  done()
}
