export enum TagName {
    DIV = 'div',
    BUTTON = 'button',
    INPUT = 'input',
    UL = 'ul',
    LI = 'li',
    SPAN = 'span',
    IMG = 'img',
    TEXTAREA = "textarea"
}

export enum EventType {
    ONCLICK = "click",
    KEYUP = "keyup",
    ONCHANGE = 'change',
    INPUT = 'input',
    ONFOCUSOUT = "focusout"
}

type Elements = HTMLElement | HTMLDivElement;

class ElementBuilder<T extends Elements> {
    private element: T;
    constructor(tag:TagName) {
        this.element = document.createElement(tag) as T;
        return this;
    }

    addId(id:string) {
        this.element.id = id;
        return this;
    }

    addClass(className:string){
        this.element.className = className;
        return this;
    }

    appendChild(element:HTMLElement) {
        this.element.appendChild(element);
        return this;
    }

    appendChilds(elements:HTMLElement[]) {
        elements.forEach((el) => {
            this.element.appendChild(el);
        })
        return this;
    }

    innerText(str:string) {
        this.element.innerText = str;
        return this;
    }

    innerHtml(str:string) {
        this.element.innerHTML = str;
        return this;
    }

    addEvent(type: EventType, event: (e:Event) => void) {
        this.element.addEventListener(type, event);
        return this;
    }

    build() {
        return this.element;
    }
}

export default ElementBuilder;