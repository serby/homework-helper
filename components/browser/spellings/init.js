var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellingGroups =
    [ require('./data/spellings-year4-summer2-week1')
    , require('./data/spellings-year4-summer2-week2')
    , require('./data/spellings-year4-summer2-week3')
    , require('./data/spellings-year4-summer2-week4')
    , require('./data/spellings-year1-4-june-2018.json')
    , require('./data/spellings-year1-14-june-2018.json')
    ]
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
