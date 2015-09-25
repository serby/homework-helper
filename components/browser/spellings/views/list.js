var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/list.jade')

class ListView extends View {

  constructor (serviceLocator, collection) {
    super(serviceLocator)
    View.apply(this, arguments)
    this.collection = collection
  }

  render () {
    this.$el.empty().append(template({ collection: this.collection.slice() }))
    return this
  }

}

module.exports = ListView
