const JsonDB = require('./JsonDB.js')
const uuid = require('./uuid.js')

const DB = new JsonDB('../../db/db.json')

class Note {
  static DB = DB
  static add(note) {
    console.log('ADD', note)
    note = new Note(note)
    let { id, title, text } = note
    this.DB.addToCollectionOrUpdate('notes', { id, title, text })
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
    this.id = id ? id : uuid()
  }

  toObject() {
    const { id, title, text } = this
    return { id, title, text }
  }
}

module.exports = Note