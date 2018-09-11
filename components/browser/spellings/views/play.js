var View = require('ventnor')
  , compileJade = require('browjadify-compile')
  , template = compileJade(__dirname + '/../templates/play.jade')
  , delay = require('lodash.delay')
  , dragon = require('../lib/dragon')
  , rewards =
    [ { id: 'QH2-TGUlwu4'
    , delay: 30000
    }
    , { id: 'KHQhp2cGZtE'
    , delay: 280000
    }
    , { id: 'FYgzizpCTKU'
    , delay: 75000
    }
    , { id: '6joOVjEemh4'
    , delay: 150000
    },
    , { id: '5Wf4iBeZMnc'
    , delay: 155000
    }
    , { id: 'ZZ0omQHiW4A'
    , delay: 240000
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
    if (mistakes === 0) {
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
  showCurrentWord (timeout = 2500) {
    this.$el.find('.js-word').removeClass('is-hidden').html(this.model.getCurrentSpellingAnswer())
    delay(() => {
      this.$el.find('.js-word').addClass('is-hidden').html('')
    }, timeout)
  }
  onStart () {
    if (this.timeout) clearTimeout(this.timeout)
    this.showCurrentWord()
    this.$el.find('.js-answer').focus().val('')
  }

  onNext () {
    this.showCurrentWord()
    this.$el.find('.js-answer').focus().val('')
  }

  onCorrect (answer) {
    this.$el.find('.js-answer').focus().val('')
    this.$el.find('.js-output').append('<span class="attempt correct">' + answer + '</span> ')
  }

  onWrong (answer) {
    this.$el.find('.js-output').append('<span class="attempt wrong">' + answer + '</span> ')
    this.showCurrentWord(1500)
  }

  handleSubmit (e) {
    e.preventDefault()
    var $answer = this.$el.find('.js-answer')
      , answer = $answer.val()

    $answer.focus()

    if (answer.trim() === '') return false
    this.emit('submit', answer)
  }

  handleRepeat () {
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
