import React from "react";
import styles from "./StartButton.module.css"; // Use module CSS

function StartButton({ onClick }) {
  // Receive onClick as a prop
  return (
    <button className={styles.startButton} onClick={onClick}>
      {/* You can use a simple text or a Windows icon (e.g., from a font icon library or SVG) */}
      <img
        src="/icons8-windows-11.svg"
        alt="Start"
        className={styles.windowsIcon}
      />
    </button>
  );
}

export default StartButton;
