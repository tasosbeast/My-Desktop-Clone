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
  onMinimize,
  onMaximize,
  status,
}) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [zIndex, setZIndex] = useState(initialZIndex); // Window will manage its own zIndex now
  const [snapZone, setSnapZone] = useState(null); // Track current snap zone
  const snapZoneRef = useRef(null); // Ref to track current snap zone for event handlers

  const windowRef = useRef(null); // Ref to the window div for dimensions
  const isDragging = useRef(false); // Use useRef to track dragging state
  const dragStart = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 }); // Store drag data

  const isMaximized = status === "maximized";

  // Snap zones configuration
  const SNAP_THRESHOLD = 20; // pixels from edge to trigger snap
  const TASKBAR_HEIGHT = 48; // height of taskbar

  useEffect(() => {
    setZIndex(initialZIndex); // Update internal zIndex when parent passes a new one
  }, [initialZIndex]);

  // Sync with parent props when not dragging
  useEffect(() => {
    if (!isDragging.current) {
      setX(initialX);
      setY(initialY);
      setWidth(initialWidth);
      setHeight(initialHeight);
    }
  }, [initialX, initialY, initialWidth, initialHeight]);

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
    if (isDragging.current && !isMaximized) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      let newX = dragStart.current.initialX + dx;
      let newY = dragStart.current.initialY + dy;

      // Basic Boundary Checks (prevent dragging off-screen)
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - TASKBAR_HEIGHT;

      // Ensure window doesn't go too far left/top
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      // Ensure window doesn't go too far right/bottom (consider window width/height)
      if (windowRef.current) {
        newX = Math.min(newX, desktopWidth - windowRef.current.offsetWidth);
        newY = Math.min(newY, desktopHeight - windowRef.current.offsetHeight);
      }

      // Detect snap zones
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      let currentSnapZone = null;

      // Left edge snap
      if (mouseX <= SNAP_THRESHOLD) {
        if (mouseY <= SNAP_THRESHOLD) {
          currentSnapZone = "top-left";
        } else if (mouseY >= desktopHeight - SNAP_THRESHOLD) {
          currentSnapZone = "bottom-left";
        } else {
          currentSnapZone = "left";
        }
      }
      // Right edge snap
      else if (mouseX >= desktopWidth - SNAP_THRESHOLD) {
        if (mouseY <= SNAP_THRESHOLD) {
          currentSnapZone = "top-right";
        } else if (mouseY >= desktopHeight - SNAP_THRESHOLD) {
          currentSnapZone = "bottom-right";
        } else {
          currentSnapZone = "right";
        }
      }
      // Top edge snap (maximize)
      else if (mouseY <= SNAP_THRESHOLD) {
        currentSnapZone = "maximize";
      }

      // Debug log to see if snap zones are being detected
      if (currentSnapZone !== snapZone) {
        console.log("Snap zone changed:", currentSnapZone);
      }

      setSnapZone(currentSnapZone);
      snapZoneRef.current = currentSnapZone;

      setX(newX);
      setY(newY);
    }
  };
  const handleMouseUp = () => {
    console.log(
      "Mouse up triggered, isDragging:",
      isDragging.current,
      "snapZone:",
      snapZoneRef.current
    ); // Debug log

    if (isDragging.current) {
      // Perform snap if in a snap zone
      if (snapZoneRef.current) {
        console.log("Snapping to:", snapZoneRef.current); // Debug log
        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight - TASKBAR_HEIGHT;

        let snapX = x;
        let snapY = y;
        let snapWidth = width;
        let snapHeight = height;

        switch (snapZoneRef.current) {
          case "left":
            snapX = 0;
            snapY = 0;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight;
            break;
          case "right":
            snapX = desktopWidth / 2;
            snapY = 0;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight;
            break;
          case "top-left":
            snapX = 0;
            snapY = 0;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight / 2;
            break;
          case "top-right":
            snapX = desktopWidth / 2;
            snapY = 0;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight / 2;
            break;
          case "bottom-left":
            snapX = 0;
            snapY = desktopHeight / 2;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight / 2;
            break;
          case "bottom-right":
            snapX = desktopWidth / 2;
            snapY = desktopHeight / 2;
            snapWidth = desktopWidth / 2;
            snapHeight = desktopHeight / 2;
            break;
          case "maximize":
            onMaximize(id);
            setSnapZone(null);
            snapZoneRef.current = null;
            isDragging.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            return; // Early return for maximize
        }

        console.log("Snap values:", { snapX, snapY, snapWidth, snapHeight }); // Debug log
        setX(snapX);
        setY(snapY);
        setWidth(snapWidth);
        setHeight(snapHeight);
        onDragStop(id, snapX, snapY, snapWidth, snapHeight);
      } else {
        onDragStop(id, x, y, width, height); // Report final position back to Desktop
      }

      setSnapZone(null); // Clear snap zone
      snapZoneRef.current = null;
    }

    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleWindowClick = () => {
    onFocus(id); // Bring this window to front when clicked
  };

  const getSnapOverlayStyle = () => {
    if (!snapZone || !isDragging.current) return { display: "none" };

    const desktopWidth = window.innerWidth;
    const desktopHeight = window.innerHeight - TASKBAR_HEIGHT;

    let overlayStyle = {
      position: "fixed",
      backgroundColor: "rgba(0, 120, 212, 0.3)",
      border: "2px solid #0078d4",
      pointerEvents: "none",
      zIndex: 9999,
      transition: "none",
    };

    switch (snapZone) {
      case "left":
        return {
          ...overlayStyle,
          left: "0px",
          top: "0px",
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight}px`,
        };
      case "right":
        return {
          ...overlayStyle,
          left: `${desktopWidth / 2}px`,
          top: "0px",
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight}px`,
        };
      case "top-left":
        return {
          ...overlayStyle,
          left: "0px",
          top: "0px",
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight / 2}px`,
        };
      case "top-right":
        return {
          ...overlayStyle,
          left: `${desktopWidth / 2}px`,
          top: "0px",
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight / 2}px`,
        };
      case "bottom-left":
        return {
          ...overlayStyle,
          left: "0px",
          top: `${desktopHeight / 2}px`,
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight / 2}px`,
        };
      case "bottom-right":
        return {
          ...overlayStyle,
          left: `${desktopWidth / 2}px`,
          top: `${desktopHeight / 2}px`,
          width: `${desktopWidth / 2}px`,
          height: `${desktopHeight / 2}px`,
        };
      case "maximize":
        return {
          ...overlayStyle,
          left: "0px",
          top: "0px",
          width: `${desktopWidth}px`,
          height: `${desktopHeight}px`,
        };
      default:
        return { display: "none" };
    }
  };

  const windowStyle = isMaximized
    ? {
        top: 0,
        left: 0,
        width: "100vw", // Full viewport width
        height: "calc(100vh - 48px)", // Full viewport height minus taskbar
        zIndex: zIndex,
      }
    : {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: zIndex,
      };

  return (
    <>
      {/* Snap overlay */}
      <div style={getSnapOverlayStyle()} />

      <div
        ref={windowRef}
        className={styles.window}
        style={windowStyle}
        onClick={handleWindowClick}
      >
        <div className={styles.titleBar} onMouseDown={handleMouseDown}>
          <span className={styles.windowTitle}>{title}</span>
          <div className={styles.windowControls}>
            {/* Minimize, Maximize buttons (functional later) */}
            <button
              className={styles.controlButton}
              onClick={() => onMinimize(id)}
            >
              —
            </button>{" "}
            {/* Minimize */}
            <button
              className={styles.controlButton}
              onClick={() => onMaximize(id)}
            >
              {isMaximized ? "⧉" : "◻"} {/* Restore Down vs Maximize icon */}
            </button>
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
    </>
  );
}

export default Window;
