import firebase from "firebase";
import { firebaseConfig } from "./config";
import IAppStorage from "./IAppStorage";
import { INote, TNoteDict } from "./INote";

class AppFirestoreStorage implements IAppStorage{
    app:firebase.firestore.Firestore;
    constructor() {
        this.app = firebase.initializeApp(firebaseConfig).firestore();
    }
    async deleteNote(id: string): Promise<void> {
        await this.app.collection('notes').doc(id).delete();
    }
    getNextId(): string {
        return this.app.collection('notes').doc().id;
    }
    async saveNote(note: INote): Promise<void> {
        this.app.collection('notes').doc(note.id).set(note);
    }
    async getNotes(): Promise<TNoteDict> {
        return await this.app.collection('notes').get().then(res => res.docs.map(doc => doc.data())).then((notes:INote[]) => {
            const notesDict:TNoteDict = {};
            notes.forEach(note => notesDict[note.id] = note);
            return notesDict;
        })
    }
    async getNote(id: string): Promise<INote> {
        return await this.app.collection('notes').doc(id).get().then(res => res.data() as INote);
    }

}

export default AppFirestoreStorage;