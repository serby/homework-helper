var Chale = require('chale')

class Collection extends Chale {
  constructor (serviceLocator) {
    super(serviceLocator)
    Chale.call(this, serviceLocator)
  }
}

module.exports = Collection
