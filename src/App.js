import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) ?? []);

  function addNote(body) {
    let newNote = {
      title: '',
      content: '',
      category: '',
      created_at: new Date(),
      last_updated: new Date(),
    }

    saveToLocalStorage(setNewNotes(newNote), 'notes');
  }

  function changeNoteValue(value, index, field) {
    let targetNote = Object.assign({}, notes[index], { [field]: value.target.value });

    let newNotes = [...notes];

    newNotes[index] = targetNote;

    setNotes(newNotes);
  }

  function removeFromNotes(index) {
    let newNotes = [...notes];

    newNotes.splice(index, 1);

    setNotes(newNotes);
    
    saveToLocalStorage(newNotes, 'notes');
  }

  function setNewNotes(newNote) {
    let newNotes = [...notes, newNote];

    setNotes(newNotes);

    return newNotes;
  }

  function saveChanges(index) {
    let targetNote = Object.assign({}, notes[index], { last_updated: new Date() });

    let newNotes = [...notes];

    newNotes[index] = targetNote;

    setNotes(newNotes);

    saveToLocalStorage(newNotes, 'notes');
  }

  function saveToLocalStorage(body, key) {
    let json = JSON.stringify(body);

    localStorage.setItem(key, json);
  }

  return (
    <div className="App p-8">
      <div className='flex justify-end mb-3'>
        <button onClick={addNote} className='rounded-md bg-cyan-600 text-white font-medium px-4 py-2'>Agregar nota</button>
      </div>
      <div className='flex flex-col space-y-2 text-white'>
        {
          notes.map((note, i) => {
            return(
              <div key={i} className='w-full h-auto bg-cyan-500 rounded-md'>
                <div className='flex justify-end bg-white px-3 py-1'>
                  <svg onClick={() => removeFromNotes(i)} className='text-red-500' viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </div>
                <div className='flex justify-between'>
                  <span>{ new Date(note.created_at).toLocaleString('es-MX', { dateStyle: 'short' }) }</span>
                  <input onBlur={() => saveChanges(i)} onChange={(e) => changeNoteValue(e, i, 'title')} value={note.title} className='bg-transparent focus:outline-none focus:ring-0'/>
                  <span>{ new Date(note.last_updated).toLocaleString('es-MX', { dateStyle: 'short' }) }</span>
                </div>
                <textarea onBlur={() => saveChanges(i)} onChange={(e) => changeNoteValue(e, i, 'content')} value={note.content} className='bg-transparent w-full h-full p-2 focus:outline-none focus:ring-0'/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
