module.exports = bundle

var browserify = require('browserify')
  , browjadify = require('browjadify')
  , babelify = require('babelify')

function bundle (entry, noParse) {

  var b = browserify(entry
    , { noParse: noParse
      , debug: true
      , quiet: true
      })

  b
    .transform(babelify)
    .transform(browjadify({ noParse: noParse, quiet: true }))

  return b

}
