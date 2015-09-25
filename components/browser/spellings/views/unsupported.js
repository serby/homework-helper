var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/unsupported.jade')

class UnsupportedView extends View {

  constructor (serviceLocator) {
    super(serviceLocator)
    View.apply(this, arguments)
  }

  render () {
    this.$el.empty().append(template())
    return this
  }

}

module.exports = UnsupportedView
