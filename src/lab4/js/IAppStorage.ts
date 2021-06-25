import { INote, TNoteDict } from "./INote";

interface IAppStorage {
    saveNote(note:INote):void|Promise<void>;
    getNotes():Promise<TNoteDict>;
    getNote(id:string):Promise<INote>;
    deleteNote(id:string):void|Promise<void>;
    getNextId():string;
}

export default IAppStorage;