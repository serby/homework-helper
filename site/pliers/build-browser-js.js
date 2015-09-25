module.exports = createTasks

var bundle = require('../../pliers/lib/create-browserify-bundler')
  , writeBrowserJs = require('../../pliers/lib/write-browser-js')
  , notify = require('../../pliers/lib/notify')
  , watchify = require('watchify')
  , async = require('async')
  , basename = require('path').basename
  , relative = require('path').relative
  , projectRoot = __dirname + '/../../'
  , destDir = __dirname + '/../assets/js/build/'
  , anyNewerFiles = require('any-newer-files')
  , browserSync = require('browser-sync')

function createTasks (pliers, config) {

  pliers('buildBrowserJs', function (done) {

    if (!anyNewerFiles(pliers.filesets.browserJs.concat(pliers.filesets.browserTemplates)
      , pliers.filesets.browserJsCompiled)) {
      pliers.logger.warn('No Browser JS changes found. No JS recompile required.')
      return done()
    }

    pliers.mkdirp(destDir)

    async.each(pliers.filesets.browserBundles, function (entry, cb) {

      var b = bundle(entry, pliers.filesets.vendorJs)
        , stream = b.bundle()
        , filename = basename(entry)
        , sourceMapWebPath = '/assets/js/build/' + filename + '.map'

      pliers.logger.debug('Building', filename)
      b.pipeline.on('error', cb)
      writeBrowserJs(pliers, stream, destDir, filename, sourceMapWebPath, cb)

    }, done)

  })

  pliers('watchBrowserJs', function () {

    pliers.filesets.browserBundles.forEach(function (entry) {

      var b = bundle(entry, pliers.filesets.vendorJs)
        , filename = basename(entry)
        , sourceMapWebPath = '/assets/js/build/' + filename + '.map'
        , w

      pliers.logger.debug('Watching', filename)

      w = watchify(b)

        .on('update', function (ids) {
          pliers.logger.debug('JS watcher saw a change', ids.map(function (path) {
            return relative(projectRoot, path)
          }))
          writeBrowserJs(pliers, w.bundle(), destDir, filename, sourceMapWebPath, function (err) {
            if (err) pliers.logger.error(err)
            notify('JS app built', config.title + ' Site')
            if (browserSync.get('site')) browserSync.get('site').reload()
          })
        })

        .on('reset', function () {
          // Each time bundle() is called, the a fresh pipeline is set up
          // so need to bind to the new pipeline's error events
          b.pipeline.on('error', function (err) { pliers.logger.error(err.message) })
        })

      // Need to trigger a bundle to start watching
      writeBrowserJs(pliers, w.bundle(), destDir, filename, sourceMapWebPath, function () {})

    })

  })

}
