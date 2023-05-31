import { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentNotes, setCurrentNotes] = useState([]);

  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) ?? []);
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) ?? []);
  const [results, setResults] = useState([]);

  const [modal, setModal] = useState('');
  const [newCategoryForm, setNewCategoryForm] = useState({ id: null, title: '', bgColor: '#000000' })
  const [newNoteForm, setNewNoteForm] = useState({ title: '', content: '', category: '', created_at: new Date(), last_updated: new Date() })

  function addNote(body) {
    saveToLocalStorage(setNewNotes(body), 'notes');
  }

  function resetNoteForm() {
    setNewNoteForm({
      title: '',
      content: '',
      category: '',
      created_at: new Date(),
      last_updated: new Date(),
    });
  }

  function resetCurrentNotes(newNotes) {
    let notes
    if (currentCategory) {
      notes = newNotes.filter((note) => note.category == currentCategory.id);
    }
    else {
      notes = newNotes;
    }

    setCurrentNotes(notes);
  }

  function changeNoteValue(value, field) {
    let targetNote = Object.assign({}, newNoteForm, { [field]: value.target.value });

    setNewNoteForm(targetNote);
  }

  function removeFromNotes(index) {
    let newNotes = [...notes];

    newNotes.splice(newNotes.indexOf(newNotes.find((note) => note.id == index)), 1);

    setNotes(newNotes);

    let newCurrentNotes = [...currentNotes];

    newCurrentNotes.splice(newCurrentNotes.indexOf(newCurrentNotes.find((note) => note.id == index)), 1);
    
    setCurrentNotes(newCurrentNotes);

    saveToLocalStorage(newNotes, 'notes')
    resetNoteForm();
    closeModal();
  }

  function setNewNotes(newNote) {
    let newNotes = [...notes, newNote];

    setNotes(newNotes);

    return newNotes;
  }

  function saveChanges(cb) {
    let targetNote = Object.assign({}, newNoteForm, { last_updated: new Date() });

    let newNotes = [...notes];

    newNotes[newNotes.indexOf(newNotes.find((note) => note.id == targetNote.id))] = targetNote;

    setNotes(newNotes);

    saveToLocalStorage(newNotes, 'notes');

    if (cb) {
      cb(newNotes);
    }
  }

  function saveToLocalStorage(body, key) {
    let json = JSON.stringify(body);

    localStorage.setItem(key, json);
  }

  function createNewCategory() {
    let targetCategory = Object.assign({}, newCategoryForm, { id: idGen() });
    let newCategories = [...categories, targetCategory];

    saveToLocalStorage(newCategories, 'categories');
    setCategories(newCategories);
    setModal('');
    setNewCategoryForm({ id: null, title: '', bgColor: '#000000' });
  }

  function updateCategoryForm(e, field) {
    let newCategoryForm2 = Object.assign({}, newCategoryForm, { [field]: e.target.value });

    setNewCategoryForm(newCategoryForm2);
  }

  function openUpdateCategoryModal(id) {
    let updateCatForm = Object.assign({}, categories.find((cat) => cat.id == id));
    setNewCategoryForm(updateCatForm);
    setModal('categoryUpdateModal')
  }

  function deleteCategory(id) {
    let newCategories = [...categories];

    newCategories.splice(newCategories.indexOf(newCategories.find((cat) => cat.id == id)), 1);

    saveToLocalStorage(newCategories, 'categories');
    setCategories(newCategories);
    setModal('');
    setNewCategoryForm({ id: null, title: '', bgColor: '#000000' });
  }

  function updateCategory() {
    let newCategories = [...categories];

    console.log(newCategoryForm);
    newCategories[newCategories.indexOf(newCategories.find((category) => category.id == newCategoryForm.id))] = Object.assign({}, newCategoryForm);

    saveToLocalStorage(newCategories, 'categories');
    setCategories(newCategories);
    setModal('');
    setNewCategoryForm({ id: null, title: '', bgColor: '#000000' });
  }

  function openCreateNoteModal() {
    setModal('updateNoteModal')
  }

  function createNote() {
    console.log(idGen());
    let noteForm = Object.assign({}, newNoteForm, { id: idGen(), category: currentCategory.id });
    addNote(noteForm);

    setCurrentNotes([...currentNotes, noteForm]);

    resetNoteForm();
    closeModal();
  }

  function openUpdateNoteModal(id) {
    console.log(id);
    let updateNoteForm = notes.find((note) => note.id == id);
    console.log(id);
    setNewNoteForm(updateNoteForm);
    setModal('updateNoteModal')
  }

  function getCurrentCategory(category) {
    setCurrentCategory(category);

    let catNotes = notes.filter((note) => note.category == category.id);

    setCurrentNotes(catNotes);
  }

  function orderByLastUpdated(array) {
    return array.sort((a, b) => {
      if (a.last_updated > b.last_updated) { return -1 }
      if (a.last_updated < b.last_updated) { return 1 }
    });
  }

  function idGen() {
    let code = ''; 

    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10);
    }

    return code;
  }

  function searchNote(s) {
    if (s === '') {
      setResults([]);
      return;
    }

    setResults(notes.filter((e) => e.title.includes(s)));
  }

  function showModal(id) {
    setModal(id);
  }

  function closeModal() {
    setModal('');
  }

  return (
    <div className="h-screen">
      <div className={`${ modal == 'categoryUpdateModal' ? '' : 'hidden' } z-50 bg-[rgba(0,0,0,.5)] h-screen w-screen fixed flex justify-center items-center p-6`}>
        <div className='w-full bg-white rounded-md flex flex-col p-6'>
          <div className='flex justify-between mb-8'>
            <span className='text-lg font-semibold'>Editar categoria</span>
            <svg onClick={() => {closeModal(); setNewCategoryForm({ title: '', bgColor: '', textColor: '' })}} className="inline" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <div className='flex flex-col space-y-3'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Nombre de categoria</label>
              <input onChange={(e) => updateCategoryForm(e, 'title')} value={ newCategoryForm.title } className="border border-gray-200 rounded-md" type="text"/>
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Color</label>
              <input onChange={(e) => updateCategoryForm(e, 'bgColor')} value={ newCategoryForm.bgColor } className="border border-gray-200 rounded-md" type="color"/>
            </div>
            <div className='flex justify-between'>
              <button onClick={() => deleteCategory(newCategoryForm.id)} className='rounded-md text-white bg-red-400 px-4 py-2 font-medium'>Eliminar</button>
              <button onClick={() => updateCategory(newCategoryForm.id)} className='rounded-md text-white bg-violet-400 px-4 py-2 font-medium'>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ modal == 'categoryModal' ? '' : 'hidden' } z-50 bg-[rgba(0,0,0,.5)] h-screen w-screen fixed flex justify-center items-center p-6`}>
        <div className='w-full bg-white rounded-md flex flex-col p-6'>
          <div className='flex justify-between mb-8'>
            <span className='text-lg font-semibold'>Crear nueva categoria</span>
            <svg onClick={() => {closeModal(); setNewCategoryForm({ title: '', bgColor: '', textColor: '' })}} className="inline" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <div className='flex flex-col space-y-3'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Nombre de categoria</label>
              <input onChange={(e) => updateCategoryForm(e, 'title')} value={ newCategoryForm.title } className="border border-gray-200 rounded-md" type="text"/>
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Color</label>
              <input onChange={(e) => updateCategoryForm(e, 'bgColor')} value={ newCategoryForm.bgColor } className="border border-gray-200 rounded-md" type="color"/>
            </div>
            <div className='flex justify-end'>
              <button onClick={() => createNewCategory()} className='rounded-md text-white bg-violet-400 px-4 py-2 font-medium'>Crear</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ modal == 'updateNoteModal' ? '' : 'hidden' } z-50 bg-[rgba(0,0,0,.5)] h-screen w-screen fixed flex justify-center items-center p-6`}>
        <div className='w-full h-full bg-white rounded-md flex flex-col p-6'>
          <div className='flex justify-between mb-8'>
            <input onBlur={() => saveChanges(resetCurrentNotes)} onChange={(e) => changeNoteValue(e, 'title')} value={newNoteForm.title} className='border border-gray-200 rounded-md text-lg font-semibold'/>
            <svg onClick={() => {closeModal(); resetNoteForm()}} className="inline" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <div className='flex flex-col h-full space-y-3'>
            <textarea style={{ resize: 'none', }} onBlur={() => saveChanges(resetCurrentNotes)} onChange={(e) => changeNoteValue(e, 'content')} value={newNoteForm.content} className='border border-gray-200 rounded-md bg-transparent w-full h-full p-2 focus:outline-none focus:ring-0'/>
            <div className='flex justify-end'>
              <button className={`${newNoteForm.id != null ? 'hidden' : ''} rounded-md text-white bg-green-400 px-4 py-2 font-medium`} onClick={() => createNote()}>Crear</button>
              <button className={`${newNoteForm.id == null ? 'hidden' : ''} rounded-md text-white bg-red-400 px-4 py-2 font-medium`} onClick={() => removeFromNotes(newCategoryForm.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-6rem)] overflow-y-auto">
        <i className="fa fa-header" aria-hidden="true"></i>
        <div className="z-40 bg-white fixed flex-col w-screen h-40px text-3xl text-justify font-bold pt-8 p-3">
          <button onClick={() => {setView('categories'); setCurrentCategory(null); setCurrentNotes([])}} className={`${!currentCategory ? 'hidden' : ''}`} type="button">
            <svg className="grid" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span>{ view == 'categories' ? (!currentCategory ? 'Categorías' : currentCategory.title) : 'Home' }</span>
          <button onClick={currentCategory ? () => openCreateNoteModal() : () => showModal('categoryModal')} type="button" className={`${ view != 'home' ? '' : 'hidden' }  items-center bg-[#9296FF] text-white text-xl p-2 ml-28 m-2 rounded-full h-12 w-12 drop-shadow-2xl`}>
            <svg className="ml-1 content-center" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19">
              </line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>

        </div>
        <div className={`${view != 'home' ? 'hidden' : ''} flex flex-col space-y-2 text-white p-5 mt-24`}>
          <input onChange={(e) => searchNote(e.target.value)} className={`border border-gray-200 rounded-md text-black`} placeholder='Buscar' type="text"/>
          <div className={`flex flex-col space-y-2`}>
            <h1 className={`${results.length > 0 ? 'hidden' : '' } font-semibold text-lg text-black`}>Notas más recientes</h1>
            {
              results.map((note, i) => {
                return(
                  <div onClick={() => openUpdateNoteModal(note.id)} style={{ borderColor: categories.find((cat) => cat.id == note.category).bgColor }} key={i} className="flex flex-col overflow-hidden bg-white border-l-8 text-black text-base p-3 w-full h-20 rounded-xl drop-shadow-lg">
                    <div className="flex justify-between ">
                        <div className='font-bold'>{ note.title }</div>
                        <div className="text-end text-xs text-black">{ new Date(note.last_updated).toLocaleString('es-MX', { dateStyle: 'short' }) }</div>
                    </div>
                    <div className="text-start text-sm truncate">{ note.content }</div>
                  </div>
                )
              })
            }
            {
              orderByLastUpdated([...notes]).splice(0, 5).map((note, i) => {
                return(
                  <div onClick={() => openUpdateNoteModal(note.id)} style={{ borderColor: categories.find((cat) => cat.id == note.category).bgColor }} key={i} className={`${ results.length > 0 ? 'hidden' : '' } flex flex-col overflow-hidden bg-white border-l-8 text-black text-base p-3 w-full h-20 rounded-xl drop-shadow-lg`}>
                    <div className="flex justify-between ">
                        <div className='font-bold'>{ note.title }</div>
                        <div className="text-end text-xs text-black">{ new Date(note.last_updated).toLocaleString('es-MX', { dateStyle: 'short' }) }</div>
                    </div>
                    <div className="text-start text-sm truncate">{ note.content }</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className={`${!currentCategory ? 'hidden' : ''} flex flex-col space-y-2 text-white p-5 mt-24`}>
          {
            currentNotes.map((note, i) => {
              return(
                <div onClick={() => openUpdateNoteModal(note.id)} style={{ borderColor: categories.find((cat) => cat.id == note.category).bgColor }} key={i} className="flex flex-col overflow-hidden bg-white border-l-8 text-black text-base p-3 w-full h-20 rounded-xl drop-shadow-lg">
                  <div className="flex justify-between ">
                      <div className='font-bold'>{ note.title }</div>
                      <div className="text-end text-xs text-black">{ new Date(note.last_updated).toLocaleString('es-MX', { dateStyle: 'short' }) }</div>
                  </div>
                  <div className="text-start text-sm truncate">{ note.content }</div>
                </div>
              )
            })
          }
        </div>
        <div className={`${currentCategory || view != 'categories' ? 'hidden' : ''} grid grid-cols-2 gap-6 content-start bg-white-500 w-screen p-5 mt-24`}>
          {
            categories.map((category, id) => {
              return (
                <div onClick={() => getCurrentCategory(category)} key={id} style={{ backgroundColor: category.bgColor }} className={`flex flex-col text-black text-center p-13 font-bold w-40 h-40 rounded-xl drop-shadow-lg`}>
                  <div className="w-full flex justify-end">
                    <button onClick={(e) => {e.stopPropagation(); openUpdateCategoryModal(category.id)}} type="button" className="drop-shadow-2xl select-none border-2 border-[#BFBFBF]  text-white text-xl font-bold p-2 m-2 rounded-full shadow h-8 w-8">
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="#BFBFBF" strokeWidth="2.5" fill="#BFBFBF" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                  </div>
                  {category.title}
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="flex h-24 justify-around bg-white-300 w-screen p-7 shadow-[0_40px_60px_-18px_rgba(0,0,0,6)]">
        <button onClick={() => {setView('home'); setCurrentCategory(null); setCurrentNotes([])}} type="button" >
          <svg viewBox="0 0 24 24" width="36" height="36" stroke="#959595" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </button>

        <button onClick={() => {setView('categories'); setCurrentCategory(null); setCurrentNotes([])}} type="button" >
          <svg viewBox="0 0 24 24" width="36" height="36" stroke="#959595" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
    </div>
  );
}

export default App;
