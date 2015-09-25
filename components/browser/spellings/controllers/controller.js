var ListView = require('../views/list')
  , StartView = require('../views/start')
  , PlayView = require('../views/play')
  , UnsupportedView = require('../views/unsupported')

function controller (serviceLocator, collection) {

  serviceLocator.router('/unsupported', () => {
    var unsupportedView = new UnsupportedView(serviceLocator)
    window.$('#app').html(unsupportedView.render().$el)
  })

  serviceLocator.router('/spellings', () => {
    var listView = new ListView(serviceLocator, collection)
    window.$('#app').html(listView.render().$el)
    listView.on('play', uri => {
      listView.remove()
      serviceLocator.router('/spellings/' + uri)
    })
  })

  serviceLocator.router('/spellings/:uri', (ctx) => {
    var startView = new StartView(serviceLocator, collection.get(ctx.params.uri))

    startView.on('start', () => {
      startView.remove()
      serviceLocator.router('/spellings/' + ctx.params.uri + '/play')
    })

    window.$('#app').html(startView.render().$el)
  })

  serviceLocator.router('/spellings/:uri/play', ctx => {
    var model = collection.get(ctx.params.uri)
      , playView = new PlayView(serviceLocator, model)

    playView.on('repeat', () => {
      model.ask()
    })

    playView.on('submit', (answer) => {
      model.answer(answer)
    })
    window.$('#app').html(playView.render().$el)

    model.start()
  })

}

module.exports = controller
