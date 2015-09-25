function dragon (html, model) {
  var $html = window.$(html)
  $html.find('.dragon').each(function (i, el) {
    var exp = (/{{(.*?)}}/g)
      , result
      , property
      , foundProperties = {}
    while ((result = exp.exec(el.innerHTML)) !== null) {
      property = result[1].split('.')[1]

      this.innerHTML = this.innerHTML.replace(result[0], '<span data-binding="' +
        property + '">' + model.get(property) + '</span>')

      foundProperties[property] = true
    }
    Object.keys(foundProperties).forEach(function (property) {
      model.on('change:' + property, function (value) {
        window.$(el).find('span[data-binding="' + property + '"]').html(value)
      })
    })
  })
  return $html
}

module.exports = dragon
