var queue = []
  , playing = false
  , msg = new window.SpeechSynthesisUtterance()
  msg.lang = 'en-GB'
  msg.voiceURI = 'Google UK English Female'
  msg.rate = 1

  msg.onend = () => {
    playing = false
    queue.shift()
    process()
  }

function say (phrase) {

  if (queue[queue.length - 1] === phrase) return
  queue.push(phrase)
  process()

}

function process () {
  if ((playing) || (queue.length === 0)) return
  playing = true
  msg.text = queue[0]
  console.log('Saying', msg.text)
  window.speechSynthesis.speak(msg)
}

module.exports = say
