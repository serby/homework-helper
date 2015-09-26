var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/list.jade')

class ListView extends View {

  constructor (serviceLocator, collection) {
    super(serviceLocator)
    View.apply(this, arguments)
    this.collection = collection
  }

  onChange () {
    var checked = this.$el.find('.js-randomExtra').is(':checked')
    this.$el.find('a').each((index, el) => {
      var $el = window.$(el)
      $el.attr('href', $el.attr('href').replace('?random', ''))
      if (checked) {
        $el.attr('href', $el.attr('href') + '?random')
      }
    })
  }

  render () {
    this.$el.empty().append(template({ collection: this.collection.slice() }))
    this.$el.find('.js-randomExtra').on('change', this.onChange.bind(this))
    return this
  }

}

module.exports = ListView
