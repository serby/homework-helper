var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellings = require('./data/spellings-2015-09-21.json')

function init (serviceLocator) {

  var collection = new Collection(serviceLocator)
  collection.add(new Model(serviceLocator, spellings))
  initController(serviceLocator, collection)

  window.$('body .js-internal').on('click', function (e) {
    e.preventDefault()
    serviceLocator.router(window.$(e.target).attr('href'))
  })

  if ('speechSynthesis' in window) {
    serviceLocator.register('say', require('./lib/say'))
    serviceLocator.router(document.location.pathname)
  } else {
    serviceLocator.router('/unsupported')
  }

}

module.exports = init
