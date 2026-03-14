window.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".display input");
  const buttons = document.querySelectorAll(".button");

  let memory = null;
  let current = "";
  let firstNumber = "";
  let operator = "";
  let memoryShown = false;
  let justEvaluated = false;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.value;

      if (display.value === "Error" && val !== "C") {
        handleClear();
      }

      if (!isNaN(val) || val === ".") handleNumber(val);
      else if (["+", "-", "*", "/"].includes(val)) handleOperator(val);
      else if (val === "=") handleEquals();
      else if (val === "C") handleClear();
      else handleMemory(val);
    });
  });

  function handleNumber(val) {

    if (justEvaluated || memoryShown) {
      current = "";
      justEvaluated = false;
      memoryShown = false;
    }


    if (val === "." && current.includes(".")) return;


    if (current.length > 12) return;

    current += val;
    display.value = current;
  }

  function handleOperator(val) {
    if (firstNumber && current && operator) {
      firstNumber = calculate(firstNumber, current, operator);
      display.value = firstNumber;
    } else if (current) {
      firstNumber = current;
    } else if (display.value !== "0" && !firstNumber) {

      firstNumber = display.value;
    }

    operator = val;
    current = "";
    justEvaluated = false;
  }

  function handleEquals() {
    if (firstNumber && current && operator) {
      const result = calculate(firstNumber, current, operator);
      display.value = result;
      current = result;
      firstNumber = "";
      operator = "";
      justEvaluated = true;
    }
  }

  function handleClear() {
    current = "";
    firstNumber = "";
    operator = "";
    memoryShown = false;
    justEvaluated = false;
    display.value = "0";
  }

  function handleMemory(val) {
    const displayVal = parseFloat(display.value);

    if (isNaN(displayVal)) return;

    if (val === "m+") {
      memory = (memory || 0) + displayVal;
      flashDisplay();
    } else if (val === "m-") {
      memory = (memory || 0) - displayVal;
      flashDisplay();
    } else if (val === "mrc") {
      if (memory !== null) {

        const formattedMemory = parseFloat(memory.toFixed(10)).toString();
        display.value = formattedMemory;
        current = formattedMemory;
        memoryShown = true;
      }
    }
  }


  function calculate(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    let result;

    switch(op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/":
        if (b === 0) return "Error";
        result = a / b;
        break;
      default: return b.toString();
    }


    return parseFloat(result.toFixed(10)).toString();
  }


  function flashDisplay() {
    display.style.opacity = "0.5";
    setTimeout(() => display.style.opacity = "1", 100);
  }
});