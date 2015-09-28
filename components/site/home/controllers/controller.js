var compileJade = require('../../../../site/lib/compile-jade')
  , urlFormatter = require('../../../../site/lib/url-formatter')
  , homeTemplate = compileJade(__dirname + '/../views/index.jade')
  , conkerTemplate = compileJade(__dirname + '/../views/conkers.jade')

function staticPage (serviceLocator, template) {
  return function (req, res) {
    var formattedUrls = urlFormatter(req)

    res.send(template(
      { config: serviceLocator.config
      , formattedUrls: formattedUrls
      , meta: serviceLocator.config.meta
      }
    ))
  }
}

module.exports = function createController (serviceLocator) {
  serviceLocator.router.get('/', staticPage(serviceLocator, homeTemplate))
  serviceLocator.router.get('/conkers', staticPage(serviceLocator, conkerTemplate))
}
