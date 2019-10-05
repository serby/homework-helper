var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/play.jade')
  , delay = require('lodash.delay')
  , dragon = require('../lib/dragon')
  , rewards =
    [ { id: 'yP86-TR6IME'
    , delay: 175000
    },
    { id: '93lrosBEW-Q'
    , delay: 199000
    },
    { id: 'x8DKg_fsacM'
    , delay: 125000
    }
    ]

function pickReward () {
  return rewards[Math.round(Math.random() * (rewards.length - 1))]
}

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
    this.$el.find('.js-end').removeClass('is-hidden')
    var delayLength = 30000
      , reward = pickReward()
    window.trackEvent('complete', 'spelling', this.model.get('_id') + ':' +
      this.model.getCurrentSpellingAnswer(), total + ':' + mistakes, reward.id)
    if (mistakes === 0) {
      window.trackEvent('reward', 'spelling', this.model.get('_id') + ':' +
      this.model.getCurrentSpellingAnswer(), )
      this.$el.find('.js-no-mistakes').removeClass('is-hidden')
      this.$el.find('.js-no-mistakes iframe').attr('src', 'https://www.youtube.com/embed/' +
        reward.id + '?rel=0&showinfo=0&autoplay=1')
      delayLength = reward.delay
    } else {
      this.$el.find('.js-mistakes').removeClass('is-hidden')
    }
    this.$el.find('.js-form').addClass('is-hidden')
    this.timeout = delay(() => {
      this.remove()
      this.serviceLocator.router('/spellings')
    }, delayLength)
  }
  showCurrentWord (timeout = 2000) {
    window.trackEvent('show', 'spelling', this.model.get('_id') + ':' + this.model.getCurrentSpellingAnswer())
    this.$el.find('.js-word').removeClass('is-hidden').html(this.model.getCurrentSpellingAnswer())
    delay(() => {
      this.$el.find('.js-word').addClass('is-hidden').html('')
    }, timeout)
    this.showWordStart = Date.now()
  }
  onStart () {
    window.trackEvent('start', 'spelling', this.model.get('_id'))
    if (this.timeout) clearTimeout(this.timeout)
    this.showCurrentWord()
    this.$el.find('.js-answer').focus().val('')
  }

  onNext () {
    this.showCurrentWord()
    this.$el.find('.js-answer').focus().val('')
  }

  onCorrect (answer) {
    window.trackEvent('correct', 'spelling', this.model.get('_id') + ':' + this.model.getCurrentSpellingAnswer(), Date.now() - this.showWordStart)
    this.$el.find('.js-answer').focus().val('')
    this.$el.find('.js-output').append('<span class="attempt correct">' + answer + '</span> ')
  }

  onWrong (answer) {
    window.trackEvent('wrong', 'spelling', this.model.get('_id') + ':' + this.model.getCurrentSpellingAnswer(), Date.now() - this.showWordStart)
    this.$el.find('.js-output').append('<span class="attempt wrong">' + answer + '</span> ')
    this.showCurrentWord(1000)
  }

  handleSubmit (e) {
    e.preventDefault()
    var $answer = this.$el.find('.js-answer')
      , answer = $answer.val()

    $answer.focus()

    if (answer.trim() === '') return false
    window.trackEvent('time', 'spelling', this.model.get('_id') + ':' + this.model.getCurrentSpellingAnswer(), Date.now() - this.showWordStart)
    this.emit('submit', answer)
  }

  handleRepeat () {
    window.trackEvent('repeat', 'spelling', this.model.get('_id') + ':' + this.model.getCurrentSpellingAnswer())
    this.emit('repeat')
    this.$el.find('.js-answer').focus()
  }

  render () {
    this.$el.empty().append(dragon(template({ model: this.model }), this.model))
    this.$el.find('.js-answer').focus()
    this.$el.find('form').on('submit', this.handleSubmit.bind(this))
    this.$el.find('.js-btn-repeat').on('click', this.handleRepeat.bind(this))
    return this
  }

}

module.exports = PlayView
