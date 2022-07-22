const luxon = require('luxon')

function currentTimestamp() { return luxon.DateTime.now().toMillis() }

function fromTimestamp(millis) {
  return luxon.DateTime.fromMillis(millis)
}

function formatForDisplay(dt) {
  return dt.format(luxon.DateTime.DATETIME_SHORT)
}

function timestampToDisplay(millis) {
  return formatForDisplay(fromTimestamp(millis))
}

module.exports = { currentTimestamp, timestampToDisplay }