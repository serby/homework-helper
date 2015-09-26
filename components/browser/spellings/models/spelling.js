'use strict'
var Model = require('merstone')
  , getPhrase = require('../lib/phrase-maker')
  , shuffle = require('lodash.shuffle')
  , plural = require('plural')
class Spelling extends Model {

  constructor (serviceLocator, spellings) {
    super()
    Model.call(this, serviceLocator
      , { current: 1
        , total: 0
        , mistakes: 0
        , _id: spellings.uri
        , spellings: spellings.spellings
        , description: spellings.description })

    this.spellings = shuffle(spellings.spellings)
    this.set('total', this.spellings.length)
  }

  start () {
    this.emit('start')
    this.serviceLocator.say('Hi Martha, are you ready to start?')
    this.set('current', 1)
    this.set('mistakes', 0)
    this.ask()
  }

  ask () {
    this.serviceLocator.say('How do you spell. ' + this.getCurrentSpelling())
  }

  getCurrentSpelling () {
    return this.spellings[this.get('current') - 1].toLowerCase()
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
    var lowerCaseAnswer = answer.toLowerCase()
    if (lowerCaseAnswer === this.getCurrentSpelling()) {
      this.serviceLocator.say(getPhrase('correct'))
      this.emit('correct', lowerCaseAnswer)
      this.next()
      return true
    } else {
      this.serviceLocator.say(getPhrase('wrong'))
      this.set('mistakes', this.get('mistakes') + 1)
      this.emit('wrong', lowerCaseAnswer)
      return false
    }
  }
}

module.exports = Spelling
