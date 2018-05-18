var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellingGroups =
    [ require('./data/spellings-year4-summer-week1.json')
    , require('./data/spellings-year4-summer-week2.json')
    , require('./data/spellings-year4-summer-week3.json')
    , require('./data/spellings-year4-summer-week4.json')
    , require('./data/spellings-year1-7-may-2018.json')
    , require('./data/spellings-year1-14-may-2018.json')
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
