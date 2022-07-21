const JsonDB = require('./JsonDB.js')
const uuid = require('./uuid.js')

const DB = new JsonDB('../../db/db.json')

class Note {
  static DB = DB
  static add(note) {
    note = new Note(note)
    let { id, title, text } = note
    this.DB.addToCollection('notes', { id, title, text })
    return note
  }
  static remove(noteId) {
    this.DB.removeById('notes', noteId)
  }
  static getAll() {
    return this.DB.getCollection('notes')
  }

  constructor({ title, text, id }) {
    this.title = title
    this.text = text
    if (!id) this.id = uuid()
  }

  toObject() {
    const { id, title, text } = this
    return { id, title, text }
  }
}

module.exports = Note