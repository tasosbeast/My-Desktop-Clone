import React, { useState, useEffect } from "react";
import styles from "./Calculator.module.css";

export default function Calculator({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
}) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);

  // Handle number input
  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      if (display === "0") {
        setDisplay(String(num));
      } else {
        setDisplay(display + num);
      }
    }
  };

  // Handle decimal point
  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  // Clear all
  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  // Clear entry
  const clearEntry = () => {
    setDisplay("0");
  };

  // Backspace
  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  // Handle operations
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);

      // Add to history
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory((prev) => [...prev.slice(-9), historyEntry]); // Keep last 10 entries
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  // Calculate result
  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        if (secondValue === 0) {
          alert("Cannot divide by zero");
          return firstValue;
        }
        return firstValue / secondValue;
      case "%":
        return (firstValue * secondValue) / 100;
      default:
        return secondValue;
    }
  };

  // Handle equals
  const equals = () => {
    if (operation && previousValue !== null) {
      performOperation(null);
    }
  };

  // Advanced operations
  const sqrt = () => {
    const value = parseFloat(display);
    if (value < 0) {
      alert("Cannot calculate square root of negative number");
      return;
    }
    const result = Math.sqrt(value);
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const percent = () => {
    const value = parseFloat(display);
    const result = value / 100;
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const reciprocal = () => {
    const value = parseFloat(display);
    if (value === 0) {
      alert("Cannot divide by zero");
      return;
    }
    const result = 1 / value;
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const plusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  // Memory operations
  const memoryClear = () => {
    setMemory(0);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForNewValue(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();

      if (e.key >= "0" && e.key <= "9") {
        inputNumber(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+") {
        performOperation("+");
      } else if (e.key === "-") {
        performOperation("-");
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        performOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        equals();
      } else if (e.key === "Escape") {
        clear();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (e.key === "%") {
        percent();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [display, operation, previousValue, waitingForNewValue]);

  // Format display value
  const formatDisplay = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Handle very large or very small numbers
    if (
      Math.abs(num) > 999999999999 ||
      (Math.abs(num) < 0.000001 && num !== 0)
    ) {
      return num.toExponential(6);
    }

    // Format with appropriate decimal places
    return value.length > 12 ? num.toPrecision(12) : value;
  };

  return (
    <div className={styles.calculator}>
      {/* Menu Bar */}
      <div className={styles.menuBar}>
        <span className={styles.title}>Calculator</span>
        <div className={styles.memoryIndicator}>
          {memory !== 0 && <span className={styles.memoryBadge}>M</span>}
        </div>
      </div>

      {/* Display */}
      <div className={styles.display}>
        <div className={styles.historyArea}>
          {history.slice(-3).map((entry, index) => (
            <div key={index} className={styles.historyEntry}>
              {entry}
            </div>
          ))}
        </div>
        <div className={styles.mainDisplay}>{formatDisplay(display)}</div>
      </div>

      {/* Button Grid */}
      <div className={styles.buttonGrid}>
        {/* Row 1 - Memory and Clear */}
        <button className={styles.memoryButton} onClick={memoryClear}>
          MC
        </button>
        <button className={styles.memoryButton} onClick={memoryRecall}>
          MR
        </button>
        <button className={styles.memoryButton} onClick={memoryAdd}>
          M+
        </button>
        <button className={styles.memoryButton} onClick={memorySubtract}>
          M-
        </button>
        <button className={styles.memoryButton} onClick={memoryStore}>
          MS
        </button>

        {/* Row 2 - Functions */}
        <button className={styles.functionButton} onClick={percent}>
          %
        </button>
        <button className={styles.functionButton} onClick={sqrt}>
          √
        </button>
        <button className={styles.functionButton} onClick={reciprocal}>
          1/x
        </button>
        <button className={styles.functionButton} onClick={plusMinus}>
          ±
        </button>
        <button className={styles.clearButton} onClick={clear}>
          C
        </button>

        {/* Row 3 */}
        <button className={styles.clearButton} onClick={clearEntry}>
          CE
        </button>
        <button className={styles.clearButton} onClick={backspace}>
          ⌫
        </button>
        <button
          className={styles.operatorButton}
          onClick={() => performOperation("÷")}
        >
          ÷
        </button>
        <button
          className={styles.operatorButton}
          onClick={() => performOperation("×")}
        >
          ×
        </button>
        <button
          className={styles.operatorButton}
          onClick={() => performOperation("-")}
        >
          -
        </button>

        {/* Rows 4-6 - Numbers and operators */}
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("7")}
        >
          7
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("8")}
        >
          8
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("9")}
        >
          9
        </button>
        <button
          className={styles.operatorButton}
          onClick={() => performOperation("+")}
        >
          +
        </button>

        <button
          className={styles.numberButton}
          onClick={() => inputNumber("4")}
        >
          4
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("5")}
        >
          5
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("6")}
        >
          6
        </button>

        <button
          className={styles.numberButton}
          onClick={() => inputNumber("1")}
        >
          1
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("2")}
        >
          2
        </button>
        <button
          className={styles.numberButton}
          onClick={() => inputNumber("3")}
        >
          3
        </button>
        <button className={styles.equalsButton} onClick={equals}>
          =
        </button>

        <button
          className={`${styles.numberButton} ${styles.zeroButton}`}
          onClick={() => inputNumber("0")}
        >
          0
        </button>
        <button className={styles.numberButton} onClick={inputDecimal}>
          .
        </button>
      </div>
    </div>
  );
}
