const { currentTimestamp } = require('./datetime.js')
const JsonDB = require('./JsonDB.js')
const uuid = require('./uuid.js')

const DB = new JsonDB('../../db/db.json')

class Note {
  static DB = DB
  static add(note) {
    note = new Note(note)
    let { id, title, text, created, edited } = note
    this.DB.addToCollectionOrUpdate('notes', { id, title, text, created, edited })
    return note
  }
  static remove(noteId) {
    this.DB.removeById('notes', noteId)
  }
  static getAll() {
    return this.DB.getCollection('notes')
  }

  constructor({ title, text, id, created }) {
    this.title = title
    this.text = text
    this.id = id ? id : uuid()
    this.created = created ? created : currentTimestamp()
    this.edited = currentTimestamp()
  }

  toObject() {
    const { id, title, text, created, edited } = this
    return { id, title, text, created, edited }
  }
}

module.exports = Note