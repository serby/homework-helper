var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/start.jade')
  , dragon = require('../lib/dragon')

class StartView extends View {

  constructor (serviceLocator, model) {
    super(serviceLocator, model)
    View.apply(this, arguments)
    this.model = model
  }

  render () {
    this.$el.empty().append(dragon(template({ model: this.model }), this.model))
    this.$el.find('.js-btn-start').on('click', this.emit.bind(this, 'start'))
    return this
  }

}

module.exports = StartView
