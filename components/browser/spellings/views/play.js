var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/play.jade')
  , delay = require('lodash.delay')
  , dragon = require('../lib/dragon')

class PlayView extends View {

  constructor (serviceLocator, model) {
    super(serviceLocator, model)
    View.apply(this, arguments)
    this.model = model

    model.on('start', this.onStart.bind(this))
    model.on('next', this.onNext.bind(this))
    model.on('correct', this.onCorrect.bind(this))
    model.on('wrong', this.onWrong.bind(this))
    model.on('complete', this.onComplete.bind(this))
  }

  onComplete (total, mistakes) {
    delay(() => {
      if (mistakes === 0) {
        this.$el.find('.js-no-mistakes').removeClass('is-hidden')
        this.$el.find('.js-no-mistakes iframe').attr('src', 'https://www.youtube.com/embed/QH2-TGUlwu4?autoplay=1')
      } else {
        this.$el.find('.js-mistakes').removeClass('is-hidden')
      }
      this.$el.find('.js-form').addClass('is-hidden')
      delay(() => {
        this.remove()
        this.serviceLocator.router('/spellings')
      }, 20000)
    }, 5000)
  }

  onStart () {
    this.$el.find('.js-answer').focus().val('')
  }

  onNext () {
    this.$el.find('.js-answer').focus().val('')
  }

  onCorrect (answer) {
    this.$el.find('.js-output').append('<span class="attempt correct">' + answer + '</span> ')
  }

  onWrong (answer) {
    this.$el.find('.js-output').append('<span class="attempt wrong">' + answer + '</span> ')
  }

  handleSubmit (e) {
    e.preventDefault()
    var $answer = this.$el.find('.js-answer')
      , answer = $answer.val()

    $answer.focus()

    if (answer === '') return false
    this.emit('submit', answer)
  }

  handleRepeat () {
    this.emit('repeat')
    this.$el.find('.js-answer').focus()
  }

  render () {
    this.$el.empty().append(dragon(template(), this.model))
    this.$el.find('.js-answer').focus()
    this.$el.find('form').on('submit', this.handleSubmit.bind(this))
    this.$el.find('.js-btn-repeat').on('click', this.handleRepeat.bind(this))
    return this
  }

}

module.exports = PlayView
