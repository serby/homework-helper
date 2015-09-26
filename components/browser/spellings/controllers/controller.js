var ListView = require('../views/list')
  , StartView = require('../views/start')
  , PlayView = require('../views/play')
  , UnsupportedView = require('../views/unsupported')
  , SpellingModel = require('../models/spelling')

function controller (serviceLocator, collection) {

  function random (orginalModel, collection) {
    var data = orginalModel.toJSON()
    collection.filter(model => {
        return orginalModel.id !== model.id
      }).forEach(model => {
        data.spellings = data.spellings.concat(model.spellings.slice(0, 2 + Math.floor(Math.random() * 5)))
      })

    return new SpellingModel(serviceLocator, data)
  }

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
    var model = collection.get(ctx.params.uri)
      , viewModel = (ctx.querystring === 'random') ? random(model, collection) : model
      , startView = new StartView(serviceLocator, viewModel)

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
