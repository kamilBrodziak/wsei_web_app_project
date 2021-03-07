
class NumInput {
  domEl : HTMLInputElement;
  isValid() : boolean { return /^\d+$/.test(this.domEl.value) };
  getValue() : string { return this.domEl.value };
  approveInput() : void {
    if(this.isValid()) {
      this.domEl.style.border = "2px solid green";
    } else {
      this.domEl.style.border = "3px solid red";
    }
  }

  constructor(eventHandler : () => void) {
    const _this = this;
    this.domEl = document.createElement("input");
    this.domEl.addEventListener('keyup', (e : KeyboardEvent) => {
      _this.approveInput();
      eventHandler();
    })
  }
}

class Calculator {
  inputs : NumInput[] = [];
  resultInputs : HTMLInputElement[] = [];
  constructor(inputCount: number) {
    this.loadInputs(inputCount);
    this.loadResultInputs();
    let domInputs : HTMLInputElement[] = [];
    this.inputs.forEach((el : NumInput) => {
      domInputs.push(el.domEl);
    })
    this.printInputs(domInputs, document.querySelector("#inputs"));
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

  private printInputs(inputs : HTMLInputElement[], container : HTMLDivElement) : void {
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

new Calculator(5);
