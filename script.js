window.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".display input");
  const buttons = document.querySelectorAll(".keys input");

  let memory = null;
  let current = "";
  let firstNumber = "";
  let operator = "";
  let memoryShown = false;
  let justEvaluated = false;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.value;

      // Цифра або крапка
      if (!isNaN(val) || val === ".") {
        if (justEvaluated || memoryShown) {
          current = "";
          justEvaluated = false;
          memoryShown = false;
        }
        current += val;
        display.value = current;
      }

      // Скидання
      else if (val === "C") {
        current = "";
        firstNumber = "";
        operator = "";
        memoryShown = false;
        justEvaluated = false;
        display.value = "";
      }

      // Оператор
      else if (["+", "-", "*", "/"].includes(val)) {
        if (firstNumber && current && operator) {
          firstNumber = calculate(firstNumber, current, operator);
          display.value = firstNumber;
        } else if (current) {
          firstNumber = current;
        }

        operator = val;
        current = "";
        justEvaluated = false;
      }

      // Обчислення
      else if (val === "=") {
        if (firstNumber && current && operator) {
          const result = calculate(firstNumber, current, operator);
          display.value = result;
          current = result;
          firstNumber = "";
          operator = "";
          justEvaluated = true;
        }
      }

      // M+ — зберегти в пам'ять
      else if (val === "m+") {
        if (display.value !== "" && display.value !== "m") {
          memory = parseFloat(display.value);
          display.value = "m";
          current = "";
          justEvaluated = false;
        }
      }

      // M- — зберегти від'ємне значення в пам'ять
      else if (val === "m-") {
        if (display.value !== "" && display.value !== "m") {
          memory = -parseFloat(display.value);
          display.value = "m";
          current = "";
          justEvaluated = false;
        }
      }

      // MRC — показати або очистити пам'ять
      else if (val === "mrc") {
        if (!memoryShown && memory !== null) {
          display.value = memory;
          current = memory.toString();
          memoryShown = true;
          justEvaluated = false;
        } else {
          memory = null;
          memoryShown = false;
          display.value = "";
          current = "";
        }
      }
    });
  });

  function calculate(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
      case "+":
        return (a + b).toString();
      case "-":
        return (a - b).toString();
      case "*":
        return (a * b).toString();
      case "/":
        return b !== 0 ? (a / b).toString() : "Error";
      default:
        return b.toString();
    }
  }
});
