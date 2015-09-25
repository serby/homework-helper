module.exports = tasks

var glob = require('glob')
  , createConfigury = require('configury')
  , config = createConfigury(__dirname + '/../config.json')(process.env.NODE_ENV)

function tasks (pliers) {

  // Load pliers plugins
  glob.sync(__dirname + '/pliers/*.js').forEach(function (file) {
    require(file)(pliers, config)
  })

  // Load filesets
  glob.sync(__dirname + '/pliers/filesets/*.js').forEach(function (file) {
    require(file)(pliers, config)
  })

}
