// src/components/Window.jsx
import React from "react";
import styles from "./Window.module.css";

function Window({
  id,
  title,
  children,
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  initialZIndex,
  onClose,
}) {
  // For now, these are initial values. We'll add state for drag/resize later.
  const style = {
    left: `${initialX}px`,
    top: `${initialY}px`,
    width: `${initialWidth}px`,
    height: `${initialHeight}px`,
    zIndex: initialZIndex,
  };

  return (
    <div className={styles.window} style={style}>
      <div className={styles.titleBar}>
        <span className={styles.windowTitle}>{title}</span>
        <div className={styles.windowControls}>
          {/* Minimize, Maximize buttons (functional later) */}
          <button className={styles.controlButton}>—</button> {/* Minimize */}
          <button className={styles.controlButton}>◻</button> {/* Maximize */}
          <button
            className={`${styles.controlButton} ${styles.closeButton}`}
            onClick={() => onClose(id)}
          >
            X
          </button>{" "}
          {/* Close */}
        </div>
      </div>
      <div className={styles.windowContent}>
        {children} {/* This will render the content passed from Desktop */}
      </div>
    </div>
  );
}

export default Window;
