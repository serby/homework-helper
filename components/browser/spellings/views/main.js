var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/main.jade')

class MainView extends View {

  constructor (...args) {
    super(...args)
    View.apply(this, arguments)
  }

  render () {
    this.$el.empty().append(template())
    return this
  }

}

module.exports = MainView
