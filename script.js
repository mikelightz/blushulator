const numberButtons = document.querySelectorAll("[data-number");
const operationButtons = document.querySelectorAll("[data-operation");
const equalsButton = document.querySelector("[data-equals");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = 0;
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString(); //convert appended number to string to avoid auto-calculation
  }

  chooseOperation(operation) {
    let newOperation = this.operation;
    if (this.currentOperand === "" && operation == "-") {
      this.appendNumber("-");
      return;
    }

    //compute an operation automatically while simultaneously completing another one.
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand; //moves current operand to previous operand
    this.currentOperand = "";
  }

  compute() {
    let computation;
    let prev = parseFloat(this.previousOperand);
    let current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return; //if the previous and current inputs aren't numbers, don't do anything
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString(); //convert to string and split number into its integer and decimal to allow multiple zeros after decimal
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0, //eliminate unnecessary decimal points w/max fraction digits
      });
    }
    //clear the previous operand value
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
}

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
); //hooking all variables to calculator

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText); // adds a number to the calculator
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText); // adds an operand to the calculator
    if (!(calculator.currentOperand == "" && button.innerText == "-")) {
      calculator.updateDisplay();
    }
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
