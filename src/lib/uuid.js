const { v4: uuid } = require('uuid')

function newUUID() {
  return uuid().replace(/-/g, '')
}

module.exports = newUUID