var compileJade = require('../../../../site/lib/compile-jade')
  , urlFormatter = require('../../../../site/lib/url-formatter')
  , template = compileJade(__dirname + '/../views/index.jade')

module.exports = function createController (serviceLocator) {

  serviceLocator.router.get('/spellings*', function (req, res) {
    var formattedUrls = urlFormatter(req)

    res.send(template(
      { config: serviceLocator.config
      , formattedUrls: formattedUrls
      , meta: serviceLocator.config.meta
      }
    ))
  })

}
