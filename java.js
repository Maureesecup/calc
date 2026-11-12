const display = document.getElementById("display");

let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let resultDisplayed = false;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERROR";
    }

    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);

        case "-":
            return subtract(a, b);

        case "×":
            return multiply(a, b);

        case "÷":
            return divide(a, b);

        default:
            return b;
    }
}

function updateDisplay(value) {
    if (value === "ERROR") {
        display.textContent = "Can't divide by zero!";
        return;
    }

    display.textContent = String(value).slice(0, 14);
}

function inputNumber(number) {
    if (display.textContent === "ERROR") {
        clearCalculator();
    }

    if (waitingForSecondNumber || resultDisplayed) {
        display.textContent = number;
        waitingForSecondNumber = false;
        resultDisplayed = false;
        return;
    }

    if (display.textContent.length < 14) {
        if (display.textContent === "0") {
            display.textContent = number;
        } else {
            display.textContent += number;
        }
    }
}

function chooseOperator(nextOperator) {
    if (display.textContent === "ERROR") return;

    const currentNumber = Number(display.textContent);

    if (operator && !waitingForSecondNumber) {
        const result = operate(
            operator,
            firstNumber,
            currentNumber
        );

        if (result === "ERROR") {
            updateDisplay("ERROR");
            clearStoredValues();
            return;
        }

        firstNumber = result;
        updateDisplay(formatResult(result));

    } else if (firstNumber === null || resultDisplayed) {
        firstNumber = currentNumber;
    }

    operator = nextOperator;
    waitingForSecondNumber = true;
    resultDisplayed = false;
}

function calculate() {
    if (
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber ||
        display.textContent === "ERROR"
    ) {
        return;
    }

    const secondNumber = Number(display.textContent);

    const result = operate(
        operator,
        firstNumber,
        secondNumber
    );

    if (result === "ERROR") {
        updateDisplay("ERROR");
        clearStoredValues();
        return;
    }

    updateDisplay(formatResult(result));

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    resultDisplayed = true;
}


function formatResult(number) {
    return Number.parseFloat(number.toPrecision(10)).toString();
}


function clearStoredValues() {
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    resultDisplayed = false;
}


function clearCalculator() {
    display.textContent = "0";
    clearStoredValues();
}


function changeSign() {
    if (display.textContent === "ERROR") return;

    display.textContent = String(
        Number(display.textContent) * -1
    );
}

function percentage() {
    if (display.textContent === "ERROR") return;

    display.textContent = String(
        Number(display.textContent) / 100
    );
}

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelector('[data-action="equals"]')
    .addEventListener("click", calculate);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="sign"]')
    .addEventListener("click", changeSign);

document.querySelector('[data-action="percent"]')
    .addEventListener("click", percentage);