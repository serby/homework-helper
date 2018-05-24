function createSay (cb) {

  if (!('speechSynthesis' in window)) return cb(new Error('Can not start speech synthesis'))
  window.speechSynthesis.getVoices()

  function say (phrase, rate) {
    //alert(window.speechSynthesis.getVoices())
    var allVoices = window.speechSynthesis.getVoices()
    , voices = allVoices.filter(voice => voice.lang === 'en-GB')
    , msg = new window.SpeechSynthesisUtterance(phrase)
    , selectedVoice = voices.find(v => v.name.match(/female/i))

    if (!selectedVoice) selectedVoice = voices[0]
    msg.voice = selectedVoice
    msg.rate = 0.85
    console.log(phrase)
    window.speechSynthesis.speak(msg)
  }

  cb(null, say)
}

module.exports = createSay
