import getEl from "../../utils/ElementGetter";
import IAppStorage from "./IAppStorage";
import {  INote } from "./INote";
import NoteBuilder from "./NoteBuilder";

class Note {
    note: INote;
    notesContainer:HTMLDivElement;
    notesPinnedContainer:HTMLDivElement;
    container: HTMLDivElement;
    storage: IAppStorage;
    constructor(active:boolean = false, storage:IAppStorage, note?:INote) {
        this.storage = storage;
        this.note = note ? note : {
            title: "",
            id: storage.getNextId(),
            body: "",
            color: "#ffffff",
            pinned: false,
            date: {
                created: Date.now()
            }
        }
        this.initElements(active);
        this.appendNote();
    }

    appendNote() {
        this.container.remove();
        if(!this.note.pinned) {
            this.notesContainer.appendChild(this.container);
        } else {
            this.notesPinnedContainer.appendChild(this.container);
        }
    }

    initElements(active:boolean) {
        this.notesContainer = getEl("#notes");
        this.notesPinnedContainer = getEl("#notesPinned");
        this.container = new NoteBuilder(active).initTitle(this.note.title, this.titleOnChange.bind(this))
            .initColorsButton(this.note.color, this.colorOnInput.bind(this), this.colorOnChange.bind(this))
            .initPinButton(this.onPin.bind(this))
            .initExpandButton(this.onExpand.bind(this))
            .initRemoveButton(this.onRemove.bind(this))
            .initDate(this.onDateUpdate.bind(this))
            .initBody(this.note.body, this.bodyOnChange.bind(this)).build();
    }

    titleOnChange(e:Event) {
        this.note.title = (<HTMLInputElement>e.target).value;
        this.saveNote();
    }

    colorOnInput(e:Event) {
        this.note.color = (<HTMLInputElement>e.target).value;
        this.container.style.background = this.note.color;
    }

    colorOnChange() {
        this.saveNote();
    }

    bodyOnChange(e:Event) {
        this.note.body = (<HTMLInputElement>e.target).value;
        this.saveNote();
    }

    onPin(el:HTMLButtonElement) {
        this.note.pinned = !this.note.pinned;
        this.appendNote();
        this.saveNote();
    }

    onExpand(el:HTMLButtonElement, title:HTMLInputElement, body:HTMLTextAreaElement, colorInput:HTMLInputElement) {
        this.container.classList.toggle('active');
        let disabled = true;
        if(this.container.classList.contains('active')) {
            disabled = false;
            el.innerHTML = "&#10004;"
        } else {
            el.innerHTML = '&#9998;'
        }
        title.disabled = disabled;
        body.disabled = disabled;
        colorInput.disabled = disabled;
    }

    onRemove() {
        this.container.remove();
        this.storage.deleteNote(this.note.id);
    }

    onDateUpdate(el:HTMLDivElement) {
        el.innerHTML = `Created:${new Date(this.note.date.created).toLocaleDateString()}${
            this.note.date.updated ? ", Updated: " + new Date(this.note.date.updated).toLocaleDateString() : ""}`;
    }

    saveNote() {
        this.note.date.updated = Date.now();
        this.storage.saveNote(this.note);
    }

}

export default Note;