import IAppStorage from "./IAppStorage";
import { INote, TNoteDict } from "./INote";


class LocalStorage implements IAppStorage {
    getNextId(): string {
        return "" + Date.now();
    }
    deleteNote(id: string): void {
        this.getNotes().then(notes => {
            delete notes[id];
            localStorage.set(this.appKey, notes);
        });
    }
    appKey: string = "noteApp"
    saveNote(note: INote): void {
        this.getNotes().then(notes => {
            if(!notes) {
                notes = {};
            }
            notes[note.id] = note;
            localStorage.setItem(this.appKey, JSON.stringify(notes));
        });
        
    }

 

    getNotes(): Promise<TNoteDict> {
        return new Promise((resolve, reject) => resolve(JSON.parse(localStorage.getItem(this.appKey))));
    }
    getNote(id: string): Promise<INote> {
        return this.getNotes().then(notes => notes[id]);
    }

}

export default LocalStorage;
