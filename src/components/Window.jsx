// src/components/Window.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
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
  onFocus,
  onDragStop,
}) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [zIndex, setZIndex] = useState(initialZIndex); // Window will manage its own zIndex now

  const windowRef = useRef(null); // Ref to the window div for dimensions
  const isDragging = useRef(false); // Use useRef to track dragging state
  const dragStart = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 }); // Store drag data

  useEffect(() => {
    setZIndex(initialZIndex); // Update internal zIndex when parent passes a new one
  }, [initialZIndex]);

  const handleMouseDown = (e) => {
    if (e.target.closest(`.${styles.controlButton}`)) {
      // Don't drag if clicking control buttons
      return;
    }

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: x,
      initialY: y,
    };

    // Add global event listeners to 'document'
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    onFocus(id); // Bring this window to front when dragging starts (and clicked)
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      let newX = dragStart.current.initialX + dx;
      let newY = dragStart.current.initialY + dy;

      // Basic Boundary Checks (prevent dragging off-screen)
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight; // Consider taskbar height later

      // Ensure window doesn't go too far left/top
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      // Ensure window doesn't go too far right/bottom (consider window width/height)
      if (windowRef.current) {
        newX = Math.min(newX, desktopWidth - windowRef.current.offsetWidth);
        // Leave space for the taskbar at the bottom (e.g., 48px)
        newY = Math.min(newY, desktopHeight - windowRef.current.offsetHeight);
      }

      setX(newX);
      setY(newY);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    onDragStop(id, x, y, width, height); // Report final position back to Desktop
  };

  const handleWindowClick = () => {
    onFocus(id); // Bring this window to front when clicked
  };

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: zIndex,
      }}
      onClick={handleWindowClick}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
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
