var allPhrases =
  { correct:
    [ 'Oh yes! You\'re flying!'
    , 'Yes, well done!'
    , 'Very good!'
    , 'Boom boom boom!'
    , 'Correct!'
    , 'Wooo! yay! That is right!'
    , 'Yep, good job!'
    , 'You\'re right, well done' ]
  , wrong: [ 'Oops! Make sure you double check your answer.', 'Not quite right buddy!', 'Sorry that\'s not right', 'Wrong I\'m affraid', 'Oh dear, I think you made a mistake.' ]
  , wellDone:
    [ 'Nice job! You should get a prize.'
    , 'Well done! You\'re really clever.'
    , 'Good work buddy! You\'re a master speller.'
    , 'Give me five dude, you got them all right!'
    ]
  }

function getPhrase (meaning) {
  var phrases = allPhrases[meaning]
    , r = Math.floor(Math.random() * phrases.length)
  return phrases[r]
}

module.exports = getPhrase
