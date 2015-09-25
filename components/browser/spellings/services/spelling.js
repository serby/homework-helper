'use strict'

var spellings =
  [ 'song'
  , 'trunk'
  , 'knee'
  , 'knit'
  , 'know'
  , 'knock'
  , 'knight'
  , 'penknife'
  , 'grandpa'
  , 'grandma'
  , 'knobbly'
  , 'kneel'
  ]
  , allPhrases =
    { correct: [ 'Yes, well done!', 'Very good!', 'Correct!', 'Yep, good job!', 'You\'re right, well done' ]
    , wrong: [ 'Not quite right buddy!', 'Sorry that\'s not right', 'Wrong I\'m affraid' ]
    , wellDone: [ 'Nice job!', 'Well done!', 'Good work!', 'Give me five dude, you got them all right!' ]
    }

function randomPhrase (meaning) {
  var phrases = allPhrases[meaning]
    , r = Math.floor(Math.random() * phrases.length)
  return phrases[r]
}

if ('speechSynthesis' in window) {

}

class Spelling {

  constructor (spellings) {
    this.spellings = spellings
    this.answers = []
    this.current = -1
    this.mistakes = 0
  }

  say (phrase) {
    var msg = new SpeechSynthesisUtterance(phrase)
    msg.lang = 'en-GB'
    msg.voiceURI = 'Google UK English Female'
    msg.rate = 1
    window.speechSynthesis.speak(msg)
  }

  start () {
    this.say('Hi Martha, are you ready to start?')
    this.next()
  }

  ask () {
    this.say('How do you spell. ' + this.getCurrent())
  }

  getCurrent () {
    return this.spellings[this.current].toLowerCase()
  }

  next () {
    this.current += 1
    if (this.current >= this.spellings.length) {
      return this.complete()
    }
    this.ask()
  }

  complete () {
    this.say(randomPhrase('wellDone'))
    if (this.mistakes === 0) {
      this.say('You didn\'t make a single mistake.')
    } else {
      this.say('I think you need a little more practice. You made ' + this.mistakes + ' mistakes.')
    }
  }

  answer (answer) {
    if (answer.toLowerCase() === this.getCurrent()) {
      this.say(randomPhrase('correct'))
      this.next()
      return true
    } else {
      this.say(randomPhrase('wrong'))
      this.mistakes += 1
      return false
    }
  }
}

$(function() {
  var spelling = new Spelling(spellings)
  , $output = $('#js-output')
  , $answer = $('[name=answer]')
  , $repeat = $('[name=repeat]')

  $answer.focus()
  spelling.start()

  $repeat.on('click', function () {
      spelling.ask()
      $answer.focus()
  })

  $('form').on('submit', function(e) {
    e.preventDefault()
    var answer = $answer.val()
    if (answer === '') return false
    if (spelling.answer(answer)) {
      $output.append('<span class="answer happy">' + answer + '</span> ')
    } else {
      $output.append('<span class="answer sad">' + answer + '</span> ')
    }

    $answer.val('')
    $answer.focus()
  })
})
