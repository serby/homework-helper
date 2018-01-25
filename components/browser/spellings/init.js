var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellingGroups =
    [ require('./data/spellings-year3-week1.json')
    , require('./data/spellings-year3-week2.json')
    , require('./data/spellings-year3-week3.json')
    , require('./data/spellings-year3-week4.json')
    , require('./data/spellings-year3-week5.json')
    , require('./data/spellings-year3-week6.json')
    , require('./data/spellings-year4-week3.json')
    , require('./data/spellings-year4-week4.json')
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
