import ElementBuilder, { EventType, TagName } from "../../utils/ElementBuilder";
import { INote } from "./INote";

class NoteBuilder {
    container: HTMLDivElement;
    active: boolean;
    titleEl:HTMLInputElement;
    bodyEl:HTMLTextAreaElement;
    colorEl:HTMLInputElement;

    constructor(active:boolean = false) {
        this.active = active;
        this.initContainer(active);
    }

    initContainer(active:boolean) {
        this.container = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('note')
            .build();
        if(active) {
            this.container.classList.add('active');
        }
        return this;
    }

    initDate(updateDate: (el:HTMLDivElement) => void) {
        const el = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('date').build();
        updateDate(el);
        this.container.appendChild(el)
        return this;
    }


    initTitle(title:string, onChange: (e:Event) => void) {
        this.titleEl= new ElementBuilder<HTMLInputElement>(TagName.INPUT).addClass('noteTitle')
            .addEvent(EventType.ONCHANGE, (e:InputEvent) => onChange(e)).build();
        this.titleEl.value = title;
        this.titleEl.disabled = !this.active;
        this.container.appendChild(this.titleEl);
        return this;
    }

    initBody(body:string, onChange: (e:Event) => void) {
        this.bodyEl = new ElementBuilder<HTMLTextAreaElement>(TagName.TEXTAREA).addClass('noteBody')
            .addEvent(EventType.ONCHANGE, (e) => onChange(e)).build();
        this.bodyEl.value = body;
        this.bodyEl.disabled = !this.active;
        this.container.appendChild(this.bodyEl);
        return this;
    }

    initPinButton(onClick: (el:HTMLButtonElement) => void) {
        const el:HTMLButtonElement = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON).addClass('notePinButton')
            .addEvent(EventType.ONCLICK, (e) => onClick(el)).innerHtml('&#128392;').build();
        this.container.appendChild(el);
        return this;
    }

    initExpandButton(onClick: (el:HTMLButtonElement, titleEl:HTMLInputElement, bodyEl:HTMLTextAreaElement, colorEl:HTMLInputElement) => void) {
        const el:HTMLButtonElement = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON).addClass('noteExpandButton')
            .addEvent(EventType.ONCLICK, (e) => onClick(el, this.titleEl, this.bodyEl, this.colorEl)).innerHtml('&#9998;').build();
        this.container.appendChild(el);
        return this;
    }

    initRemoveButton(onClick: (el:HTMLButtonElement) => void) {
        const el:HTMLButtonElement = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON).addClass('noteRemoveButton')
            .addEvent(EventType.ONCLICK, (e) => onClick(el)).innerHtml('&#10006;').build();
        this.container.appendChild(el);
        return this;
    }

    initColorsButton(color:string, onInput: (e:Event) => void, onChange: () => void) {
        this.colorEl = new ElementBuilder<HTMLInputElement>(TagName.INPUT).addClass('noteColorButton')
            .addEvent(EventType.INPUT, (e) => onInput(e)).addEvent(EventType.ONCHANGE, () => onChange()).build();
        
        this.colorEl.type = 'color';
        this.colorEl.value = color;
        this.container.style.background = color;
        this.colorEl.disabled = !this.active;
        this.container.appendChild(this.colorEl);
        return this;
    }

    build() {
        return this.container;
    }
}

export default NoteBuilder;