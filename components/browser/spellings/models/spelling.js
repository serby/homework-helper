'use strict'
var Model = require('merstone')
  , getPhrase = require('../lib/phrase-maker')
  , shuffle = require('lodash.shuffle')
  , plural = require('plural')

const normaliseAnswer = spelling => spelling.toLowerCase().trim().replace(/[^a-z]/g, '')

class Spelling extends Model {

  constructor (serviceLocator, spellings) {
    super()
    Model.call(this, serviceLocator
      , { current: 1
        , total: 0
        , mistakes: 0
        , _id: spellings.uri
        , description: spellings.description })

    this.setSpellings(spellings.spellings)
  }

  setSpellings (spellings) {
    this.set('spellings', spellings)
    this.spellings = shuffle(spellings)
    this.set('total', this.spellings.length)
  }

  getSpellingList () {
    return this.spellings.map(spelling => typeof spelling === 'string' ? spelling : spelling.answer)
  }

  start () {
    this.emit('start')
    this.serviceLocator.say('Are you ready to start?')
    this.set('current', 1)
    this.set('mistakes', 0)
    this.ask()
  }

  ask (rate) {
    var current = this.getCurrentSpellingQuestion()
    this.serviceLocator.say('How do you spell. ' + current, rate)
    this.emit('ask', current)
  }

  getCurrentSpellingAnswer () {
    var spelling = this.spellings[this.get('current') - 1]
    if (typeof spelling === 'string') return spelling.toLowerCase()
    return spelling.answer.toLowerCase()
  }

  getCurrentSpellingQuestion () {
    var spelling = this.spellings[this.get('current') - 1]
    if (typeof spelling === 'string') return spelling
    return spelling.question.toLowerCase()
  }

  next () {
    if (this.get('current') >= this.spellings.length) {
      return this.complete()
    }
    this.set('current', this.get('current') + 1)
    this.emit('next', this.get('current'))
    this.ask()
  }

  complete () {
    this.serviceLocator.say(getPhrase('wellDone'))
    if (this.get('mistakes') === 0) {
      this.serviceLocator.say('You didn\'t make a single mistake.')
    } else {
      this.serviceLocator.say('I think you need a little more practice. You made ' +
        this.get('mistakes') + ' ' + plural('mistake', this.get('mistakes')) + '.')
    }
    this.emit('complete', this.get('total'), this.get('mistakes'))
  }

  answer (answer) {
    var lowerCaseAnswer = normaliseAnswer(answer)
    if (lowerCaseAnswer === normaliseAnswer(this.getCurrentSpellingAnswer())) {
      this.serviceLocator.say(getPhrase('correct'))
      this.emit('correct', answer.toLowerCase())
      this.next()
      return true
    } else {
      this.serviceLocator.say(getPhrase('wrong'))
      this.set('mistakes', this.get('mistakes') + 1)
      this.emit('wrong', answer.toLowerCase())
      this.ask(0.75)
      return false
    }
  }
}

module.exports = Spelling
