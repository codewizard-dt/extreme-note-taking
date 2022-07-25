const express = require('express')
const path = require('path')
const Note = require('./src/lib/Note.js')

const app = express()
const port = process.env.PORT

/**
 * 
 * The following HTML routes should be created:
 * - `GET /notes` should return the `notes.html` file.
 * - `GET *` should return the `index.html` file.
 * 
 * The following API routes should be created:
 * - `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
 * - `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
 * 
 */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
  res.status(200).json(Note.getAll())
})
app.post('/api/notes', (req, res) => {
  let note = Note.add(req.body)
  res.status(200).json(note.toObject())
})
app.delete('/api/notes/:id', (req, res) => {
  let { id } = req.params
  Note.remove(id)
  res.json(true)
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './src/pages/notes.html'));
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/pages/index.html'));
})

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})