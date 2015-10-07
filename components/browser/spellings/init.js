var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellingGroups =
    [ require('./data/spellings-2015-10-05.json')
    , require('./data/spellings-2015-09-28.json')
    , require('./data/spellings-2015-09-21.json')
    , require('./data/spellings-group1.json')
    , require('./data/spellings-group2.json') ]
  , initSay = require('./lib/say')

function init (serviceLocator) {

  var collection = new Collection(serviceLocator)

  spellingGroups.forEach(function (spellings) {
    collection.add(new Model(serviceLocator, spellings))
  })

  initController(serviceLocator, collection)

  initSay((err, say) => {
    if (err) {
      serviceLocator.router('/unsupported')
    } else {
      serviceLocator.register('say', say)
      serviceLocator.router(document.location.pathname)
    }
  })
}

module.exports = init
