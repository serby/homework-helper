var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , say = require('./lib/say')
  , spellings = require('./data/spellings-2015-09-21.json')

function init (serviceLocator) {
  serviceLocator.register('say', say)
  var collection = new Collection(serviceLocator)
  collection.add(new Model(serviceLocator, spellings))
  initController(serviceLocator, collection)

  serviceLocator.router(document.location.pathname)

  window.$('body .js-internal').on('click', function (e) {
    e.preventDefault()
    serviceLocator.router(window.$(e.target).attr('href'))
  })

}

module.exports = init
