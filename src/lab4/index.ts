import './scss/index.scss';
import NotesController from './js/NoteController';
import LocalStorage from './js/LocalStorage';
import AppFirestoreStorage from './js/AppFirestoreStorage';

new NotesController(new AppFirestoreStorage());