var iOS9voice =
    { name: 'Daniel'
    , voiceURI: 'com.apple.ttsbundle.Daniel-compact'
    , lang: 'en-GB'
    , localService: true
    , 'default': true }
    , selectedVoice
    , rate = 1

function createSay (cb) {

  if (!('speechSynthesis' in window)) return cb(new Error('Can not start speech synthesis'))
  window.speechSynthesis.getVoices()

  setTimeout(() => {
    var allVoices = window.speechSynthesis.getVoices()
    , voices = allVoices.filter(voice => { return voice.lang === 'en-GB' })
    selectedVoice = voices[0]
    if (selectedVoice === undefined) {
      selectedVoice = iOS9voice
      rate = 0.3
    } else {
      selectedVoice = voices.filter(voice => { return (/female/i).test(voice.name) })[0] || selectedVoice
    }
    cb(null, say)
  }, 300)

  function say (phrase) {
    var msg = new window.SpeechSynthesisUtterance(phrase)
    msg.voice = selectedVoice
    msg.rate = rate
    console.log(phrase)
    window.speechSynthesis.speak(msg)
  }
}

module.exports = createSay
