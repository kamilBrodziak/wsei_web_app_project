
class NumInput {
  container : HTMLDivElement;
  numInput : HTMLInputElement;
  checkInput: HTMLInputElement;
  isValid() : boolean { return /^\d+$/.test(this.numInput.value) };
  getValue() : string { return this.numInput.value };
  isChecked() : boolean { return  this.checkInput.checked };
  approveInput() : void {
    if(this.isValid()) {
      this.numInput.style.border = "2px solid green";
    } else {
      this.numInput.style.border = "3px solid red";
    }
  }
  remove() : void {
    this.container.remove();
  }

  constructor(eventHandler : () => void) {
    const _this = this;
    this.container = document.createElement("div");
    this.numInput = document.createElement("input");
    this.numInput.type = "number";
    this.checkInput = document.createElement("input");
    this.checkInput.type = "checkbox";
    this.numInput.addEventListener('keyup', (e : KeyboardEvent) => {
      _this.approveInput();
      eventHandler();
    })
    this.container.appendChild(this.numInput);
    this.container.appendChild(this.checkInput);
  }
}

class Calculator {
  inputs : NumInput[] = [];
  resultInputs : HTMLInputElement[] = [];
  constructor(inputCount: number) {
    this.loadInputs(inputCount);
    this.loadResultInputs();
    let domInputs : HTMLDivElement[] = [];
    this.inputs.forEach((el : NumInput) => {
      domInputs.push(el.container);
    })
    const inputContainer : HTMLDivElement = document.querySelector("#inputs");
    this.printInputs(domInputs, inputContainer);
    this.printRemoveButton(inputContainer);
    this.printInputs(this.resultInputs, document.querySelector("#result_inputs"));
  }

  private loadInputs(inputCount: number) : void {
    for(let i = 0; i < inputCount; ++i) {
      this.inputs.push(new NumInput(() => this.calculateResult()));
    }
  }

  private loadResultInputs() : void {
    let ids : string[] = ["sum", "avg", "min", "max"];
    for(let i = 0; i < 4; ++i) {
      let el : HTMLInputElement = document.createElement("input");
      el.id = ids[i];
      el.disabled = true;
      this.resultInputs.push(el);
    }
  }

  private printRemoveButton(container : HTMLDivElement) : void {
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    const _this = this;
    removeButton.addEventListener("click", () => {
      for(let i = _this.inputs.length - 1; i >=0; --i) {
        const el = _this.inputs[i];
        if(el.isChecked()) {
          el.remove();
          _this.inputs.splice(i, 1);
          _this.calculateResult();
        }
      }
    });
    container.appendChild(removeButton);
  }

  private printInputs(inputs : HTMLElement[], container : HTMLDivElement) : void {
    inputs.forEach((el : HTMLInputElement) => {
      container.appendChild(el);
    })
  }

  private calculateResult() {
    if(this.inputs.every((el : NumInput) => el.isValid())) {
      const values : number[] = [];
      this.inputs.forEach((el : NumInput) => {
        values.push(+el.getValue());
      })
      const sum : number = values.reduce((a : number, b : number) => a + b, 0);
      this.resultInputs[0].value = "" + sum;
      this.resultInputs[1].value = "" + sum / values.length;
      this.resultInputs[2].value = "" + Math.min(...values);
      this.resultInputs[3].value = "" + Math.max(...values);
    } else {
      this.resultInputs[0].value = "?";
      this.resultInputs[1].value = "?";
      this.resultInputs[2].value = "?";
      this.resultInputs[3].value = "?";
    }
  }
}
const container : HTMLDivElement = document.createElement("div");
const countInput : HTMLInputElement = document.createElement("input");
countInput.type = "number";
countInput.min = "1";
countInput.max = "10";
countInput.value = "5";
const button = document.createElement("button");
button.innerText = "Create"
container.appendChild(countInput);
container.appendChild(button);
button.addEventListener("click", () => {
  new Calculator(+countInput.value);
  container.remove();
});
document.querySelector("#root").appendChild(container)

