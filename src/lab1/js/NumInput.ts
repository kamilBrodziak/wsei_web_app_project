import ElementBuilder, { EventType, TagName } from "../../utils/ElementBuilder";

class NumInput {
    container : HTMLDivElement;
    numInput : HTMLInputElement;

    constructor(keyUp : (e?:Event) => void, remove:(e?:Event) => void) {
        document.createElement('input').addEventListener('keyup', (e) => {
            
        })
        this.numInput = new ElementBuilder<HTMLInputElement>(TagName.INPUT).addClass('calculatorInput')
            .addEvent(EventType.INPUT, (e:Event) => {
                this.approveInput();
                keyUp(e);
            }).build();
        const button = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON).addClass('inputRemoveButton')
            .addEvent(EventType.ONCLICK, (e) => {
                this.container.remove();
                remove(e);
            }).build();
        this.numInput.type = "number";
        this.numInput.value = "0";
        this.container = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('inputContainer')
            .appendChilds([this.numInput, button]).build()
        
    }

    getEl():HTMLDivElement {return this.container}
    isValid() : boolean { return /^\d+$/.test(this.numInput.value) };
    getValue() : string { return this.numInput.value };
    approveInput() : void {
        if(this.isValid()) {
            this.numInput.classList.remove('disapproved');
            this.numInput.classList.add('approved');
        } else {
            this.numInput.classList.remove('approved');
            this.numInput.classList.add('disapproved');
        }
    }
}

export default NumInput;