import getEl from "../../utils/ElementGetter";
import IAppStorage from "./IAppStorage";
import { TNoteDict } from "./INote";
import Note from "./Note";
import NoteBuilder from "./NoteBuilder";

class NotesController {
    storage:IAppStorage;
    addNoteButton:HTMLButtonElement;
    constructor(storage:IAppStorage) {
        this.storage = storage;
        this.loadNotes();
        this.initElements();
    }

    initElements() {
        this.initAddElement();        
    }

    initAddElement() {
        this.addNoteButton = getEl("#noteAddButton");
        this.addNoteButton.addEventListener('click', () => {
             new Note(true, this.storage);
        })
    }


    loadNotes() {
        this.storage.getNotes().then((notes:TNoteDict) => {
            Object.values(notes).forEach(note => {
                new Note(false, this.storage, note);
            })
        });
    }
}

export default NotesController;