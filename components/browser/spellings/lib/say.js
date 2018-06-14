function createSay (cb) {

  if (!('speechSynthesis' in window)) return cb(new Error('Can not start speech synthesis'))
  window.speechSynthesis.getVoices()

  function say (phrase, cb) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
    var allVoices = window.speechSynthesis.getVoices()
    , voices = allVoices.filter(voice => voice.lang === 'en-GB')
    , msg = new window.SpeechSynthesisUtterance(phrase)
    , selectedVoice = voices.find(v => v.name.match(/female/i))

    if (!selectedVoice) selectedVoice = voices[0]
    msg.voice = selectedVoice
    msg.rate = 0.85
    msg.onend = function (event) {
      console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.')
      if (cb) cb()
    }
    window.speechSynthesis.speak(msg)
  }

  cb(null, say)
}

module.exports = createSay
