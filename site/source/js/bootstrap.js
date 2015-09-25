module.exports = bootstrap

var components =
  [ require('../../../components/browser/spellings/init') ]

function bootstrap (serviceLocator) {
  components.forEach(function (component) {
    component(serviceLocator)
  })
}
