//
// Main browser app entry point
//

// Export jQuery everywhere for modules that rely on its globalism
window.$ = window.jQuery = global.jQuery = global.$ = require('../../../site/source/js/lib/vendor/jquery-1.11.3.min.js')

// Runtime for pre-compiled Jade templates
window.jade = require('jade/runtime')

var serviceLocator = require('service-locator')()
  , Emitter = require('events').EventEmitter
  , router = require('page')

  // Responsive designs need breakpoint events to
  // fire in JS when the browser window is resized
  , createBreakpointManager = require('break')
  , bm = createBreakpointManager()
  , breakpoints = require('./breakpoints')

router()
router('*', function (ctx, next) {
  window.track()
  next()
})

// Create breakpoints on the next tick so that modules
// can know which breakpoint the page was loaded in
process.nextTick(function () {
  bm.add('desktop', breakpoints.desktopMq)
})

serviceLocator.register('breakpointManager', bm)
serviceLocator.register('config', require('../../../config.json'))
serviceLocator.register('hub', new Emitter())
serviceLocator.register('logger', require('./logger'))
serviceLocator.register('router', router)

// Bootstrap all the of the components
require('./bootstrap')(serviceLocator)
