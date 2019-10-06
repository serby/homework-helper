var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/start.jade')
  , dragon = require('../lib/dragon')

class StartView extends View {

  constructor (serviceLocator, model) {
    super(serviceLocator, model)
    View.apply(this, arguments)
    this.model = model
    this.peek = false
  }

  onChange () {
    this.peek = this.$el.find('.js-peek').is(':checked')
  }

  render () {
    this.$el.empty().append(dragon(template({ model: this.model }), this.model))
    this.$el.find('.js-btn-start').on('click', () => this.emit('start', this.peek))
    this.$el.find('.js-peek').on('change', this.onChange.bind(this))
    return this
  }

}

module.exports = StartView
