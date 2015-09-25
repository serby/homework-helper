var MainView = require('./views/main')

function init (serviceLocator) {
  var mainView = new MainView(serviceLocator)
  mainView.render().$el.appendTo('#app')
}

module.exports = init
