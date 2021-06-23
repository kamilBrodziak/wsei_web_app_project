import getEl from "../../utils/ElementGetter";
import NumInput from "./NumInput";

class Calculator {
    addButton: HTMLButtonElement;
    count: number = 0;
    inputs: {[id:number]:NumInput} = {};
    sumElement: HTMLSpanElement;
    averageElement: HTMLSpanElement;
    minElement: HTMLSpanElement;
    maxElement: HTMLSpanElement;
    container: HTMLDivElement;

    constructor() {
        this.queryHtmlContent();
        this.loadInputs(3);
        this.loadAddButton();
        this.printInputs();
    }

    private loadAddButton() {
        this.addButton.addEventListener('click', (e) => {
            this.loadInputs(1);
            this.printInputs();
        })
    }

    private queryHtmlContent() {
        this.addButton = getEl("#addInputButton");
        this.sumElement = getEl("#sum");
        this.averageElement = getEl("#average");
        this.minElement = getEl("#min");
        this.maxElement = getEl("#max");
        this.container = getEl("#inputsContainer")
    }

    private removeInput(id:number) {
        console.log(id);
        delete this.inputs[id];
        this.printInputs();
        this.calculateResult();
    }
  
    private loadInputs(inputCount: number) {
        for(let i = this.count; i < this.count + inputCount; ++i) {
            this.inputs[i] = new NumInput(() => this.calculateResult(), () => this.removeInput(i));
        }
        this.count += inputCount;
        this.calculateResult();
    }
  
    private printInputs() {
        this.container.innerHTML = "";
        Object.values(this.inputs).forEach(el => {
            this.container.appendChild(el.getEl());
        })
    }
  
    private calculateResult() {
        type result = number|string;
        const assignToResults = (sum: result, avg: result, min:result, max:result) => {
            this.sumElement.innerText = "" + sum;
            this.averageElement.innerText = "" + avg;
            this.minElement.innerText = "" + min;
            this.maxElement.innerText = "" + max;
        }
        const inputs = Object.values(this.inputs);
        if(inputs.every((el : NumInput) => el.isValid()) && inputs.length) {
            const values : number[] = [];
            inputs.forEach((el : NumInput) => {
                values.push(+el.getValue());
            })
            const sum : number = values.reduce((a : number, b : number) => a + b, 0);
            assignToResults(sum, sum/values.length, Math.min(...values), Math.max(...values));
        } else {
            assignToResults("?", "?", "?", "?");
        }
    }
}

export default Calculator;