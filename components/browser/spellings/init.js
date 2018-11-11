var Model = require('./models/spelling')
  , Collection = require('./collections/collection')
  , initController = require('./controllers/controller')
  , spellingGroups =
  [ require(`./data/spellings-year5-michaelmas1-week1.json`)
  , require(`./data/spellings-year5-michaelmas1-week2.json`)
  , require(`./data/spellings-year5-michaelmas1-week3.json`)
  , require(`./data/spellings-year5-michaelmas1-week4.json`)
  , require(`./data/spellings-year5-michaelmas1-week5.json`)
  , require(`./data/spellings-year5-michaelmas1-week6.json`)
  , require(`./data/spellings-year5-michaelmas2-week1.json`)
  , require(`./data/spellings-year5-michaelmas2-week2.json`)
  , require(`./data/spellings-year5-michaelmas2-week3.json`)
  , require(`./data/spellings-year5-michaelmas2-week4.json`)
  , require(`./data/spellings-year5-michaelmas2-week5.json`)
  , require(`./data/spellings-year2-8-oct-2018.json`)
  , require(`./data/spellings-year2-7-nov-2018.json`)
  ]
  , initSay = require('./lib/say')
if (process.env.NODE_ENV === 'development') spellingGroups.push(require('./data/test.json'))

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
