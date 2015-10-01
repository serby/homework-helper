var assert = require('assert')
  , SpellingModel = require('../../models/spelling')
  , after = require('lodash.after')

function noop () {
}

describe('spelling model', function () {

  it('should lowercase answer', done => {
    var sl = { say: noop }
      , spelling = new SpellingModel(sl, { uri: 'tets', spellings: [ 'apple', 'banana' ] })
    spelling.start()
    spelling.on('wrong', answer => {
      assert.equal(answer, 'wrong')
      done()
    })
    spelling.answer('WRONG')
  })

  it('should strip spaces', done => {
    var sl = { say: noop }
      , spelling = new SpellingModel(sl, { uri: 'tets', spellings: [ 'apple', 'banana' ] })
    spelling.start()
    spelling.on('wrong', answer => {
      assert.equal(answer, 'wrong')
      done()
    })
    spelling.answer('   wrong    ')
  })

  it('should re-ask question when wrong', done => {

    var sl = { say: noop }
      , spelling = new SpellingModel(sl, { uri: 'test', spellings: [ 'apple', 'banana' ] })
      , answers = []
      , twice = after(2, () => {
        assert.equal(answers[0], answers[1], 'Both should be the same')
        done()
      })

    spelling.on('ask', spelling => {
      answers.push(spelling)
      twice()
    })

    spelling.start()
    spelling.answer('wrong')
  })
})
