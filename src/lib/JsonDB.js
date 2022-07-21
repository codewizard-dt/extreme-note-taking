const fs = require('fs')
const path = require('path')

class JsonDB {
  connected = false
  data = {}

  constructor(filename) {
    this.file = filename
    if (this.fileExists()) this.data = this.parsedFile()
  }

  addToCollection(collectionName, item) {
    const collection = this.getCollection(collectionName)
    if (collection.find(existing => existing.id !== item.id)) {
      collection.push(item)
      this.setCollection(collectionName, collection)
    }
  }
  setCollection(collectionName, data) {
    this.data[collectionName] = data
    this.writeFile(this.data)
  }
  saveCollection(collectionName) {
    const data = this.parsedFile()
    data[collectionName] = this.data[collectionName]
    this.writeFile(data)
  }
  getCollection(collectionName) {
    return this.data[collectionName] || []
  }
  removeById(collectionName, id) {
    let collection = this.getCollection(collectionName).filter(item => item.id !== id)
    this.setCollection(collectionName, collection)
  }


  getData() {
    return this.data
  }
  fileExists() {
    return fs.existsSync(this.getFilePath())
  }
  getFilePath() {
    let resolved = path.resolve(__dirname, this.file)
    return resolved
  }
  readFile() {
    let filepath = this.getFilePath()
    console.log(filepath)
    return this.fileExists() ? fs.readFileSync(filepath, 'utf8') : '{}'
  }
  parsedFile() {
    let data = this.readFile()
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error({ data, error })
    }

  }
  writeFile(data) {
    if (typeof data !== 'string') data = JSON.stringify(data, null, 2)
    fs.writeFile(this.getFilePath(), data, () => { })
  }

}

module.exports = JsonDB