
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let timestampCreated;
let timestampEdited;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
  timestampCreated = document.querySelector('.timestamp.created');
  timestampEdited = document.querySelector('.timestamp.edited');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  if (activeNote.id) {

    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    let date = timestampToDisplay(activeNote.created);
    timestampCreated.textContent = `Created: ${timestampToDisplay(activeNote.created)}`;
    timestampEdited.textContent = `Edited: ${timestampToDisplay(activeNote.edited)}`;
  } else {
    noteTitle.value = '';
    noteText.value = '';
    timestampCreated.textContent = '';
    timestampEdited.textContent = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  if (activeNote.id) {
    newNote.id = activeNote.id
    newNote.created = activeNote.created
    newNote.edited = activeNote.edited

    activeNote = newNote
  }
  saveNote(newNote).then(() => {
    hide(saveNoteBtn)
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  let target = e.target.getAttribute('class').includes('list-group-item') ? e.target : e.target.parentElement
  activeNote = JSON.parse(target.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  let titleValue = noteTitle.value.trim()
  let textValue = noteText.value.trim()
  let { title, text } = activeNote
  if (!titleValue || !textValue) {
    hide(saveNoteBtn);
  } else if (titleValue !== title || textValue !== text) {
    show(saveNoteBtn);
  } else if (titleValue === title && textValue === text) {
    hide(saveNoteBtn)
  }
};

const handleMetaEnterPress = (ev) => {
  const { key, metaKey } = ev
  if (key === 'Enter' && metaKey && saveNoteBtn.style.display !== 'none') {
    handleNoteSave()
  }
}

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.addEventListener('click', handleNoteView);

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  jsonNotes = jsonNotes.sort(({ edited: e1 }, { edited: e2 }) => e2 - e1)
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
    if (note.id === activeNote.id) {
      console.log({ note: note.edited, activeNote: activeNote.edited })
      activeNote = note
    }
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
    renderActiveNote()
  }
};

function fromTimestamp(millis) {
  return luxon.DateTime.fromMillis(millis)
}

function formatForDisplay(dt) {
  let display = dt.toLocaleString(luxon.DateTime.DATETIME_SHORT)
  return display
}

function timestampToDisplay(millis) {
  return formatForDisplay(fromTimestamp(millis))
}


// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  noteTitle.addEventListener('keydown', handleMetaEnterPress);
  noteText.addEventListener('keydown', handleMetaEnterPress);
}

getAndRenderNotes();
