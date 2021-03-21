var NumInput = /** @class */ (function () {
    function NumInput(eventHandler) {
        var _this = this;
        this.container = document.createElement("div");
        this.numInput = document.createElement("input");
        this.numInput.type = "number";
        this.checkInput = document.createElement("input");
        this.checkInput.type = "checkbox";
        this.numInput.addEventListener('keyup', function (e) {
            _this.approveInput();
            eventHandler();
        });
        this.container.appendChild(this.numInput);
        this.container.appendChild(this.checkInput);
    }
    NumInput.prototype.isValid = function () { return /^\d+$/.test(this.numInput.value); };
    ;
    NumInput.prototype.getValue = function () { return this.numInput.value; };
    ;
    NumInput.prototype.isChecked = function () { return this.checkInput.checked; };
    ;
    NumInput.prototype.approveInput = function () {
        if (this.isValid()) {
            this.numInput.style.border = "2px solid green";
        }
        else {
            this.numInput.style.border = "3px solid red";
        }
    };
    NumInput.prototype.remove = function () {
        this.container.remove();
    };
    return NumInput;
}());
var Calculator = /** @class */ (function () {
    function Calculator(inputCount) {
        this.inputs = [];
        this.resultInputs = [];
        this.loadInputs(inputCount);
        this.loadResultInputs();
        var domInputs = [];
        this.inputs.forEach(function (el) {
            domInputs.push(el.container);
        });
        var inputContainer = document.querySelector("#inputs");
        this.printInputs(domInputs, inputContainer);
        this.printRemoveButton(inputContainer);
        this.printInputs(this.resultInputs, document.querySelector("#result_inputs"));
    }
    Calculator.prototype.loadInputs = function (inputCount) {
        var _this_1 = this;
        for (var i = 0; i < inputCount; ++i) {
            this.inputs.push(new NumInput(function () { return _this_1.calculateResult(); }));
        }
    };
    Calculator.prototype.loadResultInputs = function () {
        var ids = ["sum", "avg", "min", "max"];
        for (var i = 0; i < 4; ++i) {
            var el = document.createElement("input");
            el.id = ids[i];
            el.disabled = true;
            this.resultInputs.push(el);
        }
    };
    Calculator.prototype.printRemoveButton = function (container) {
        var removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        var _this = this;
        removeButton.addEventListener("click", function () {
            for (var i = _this.inputs.length - 1; i >= 0; --i) {
                var el = _this.inputs[i];
                if (el.isChecked()) {
                    el.remove();
                    _this.inputs.splice(i, 1);
                    _this.calculateResult();
                }
            }
        });
        container.appendChild(removeButton);
    };
    Calculator.prototype.printInputs = function (inputs, container) {
        inputs.forEach(function (el) {
            container.appendChild(el);
        });
    };
    Calculator.prototype.calculateResult = function () {
        if (this.inputs.every(function (el) { return el.isValid(); })) {
            var values_1 = [];
            this.inputs.forEach(function (el) {
                values_1.push(+el.getValue());
            });
            var sum = values_1.reduce(function (a, b) { return a + b; }, 0);
            this.resultInputs[0].value = "" + sum;
            this.resultInputs[1].value = "" + sum / values_1.length;
            this.resultInputs[2].value = "" + Math.min.apply(Math, values_1);
            this.resultInputs[3].value = "" + Math.max.apply(Math, values_1);
        }
        else {
            this.resultInputs[0].value = "?";
            this.resultInputs[1].value = "?";
            this.resultInputs[2].value = "?";
            this.resultInputs[3].value = "?";
        }
    };
    return Calculator;
}());
var container = document.createElement("div");
var countInput = document.createElement("input");
countInput.type = "number";
countInput.min = "1";
countInput.max = "10";
countInput.value = "5";
var button = document.createElement("button");
button.innerText = "Create";
container.appendChild(countInput);
container.appendChild(button);
button.addEventListener("click", function () {
    new Calculator(+countInput.value);
    container.remove();
});
document.querySelector("#root").appendChild(container);
