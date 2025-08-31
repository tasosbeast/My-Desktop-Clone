import React, { useEffect, useRef } from "react";
import styles from "./ContextMenu.module.css";

function ContextMenu({ x, y, items, onClose, visible }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  // Adjust position to prevent menu from going off-screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - (items.length * 32 + 8));

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.type === "separator" ? (
            <div className={styles.separator} />
          ) : (
            <div
              className={`${styles.menuItem} ${
                item.disabled ? styles.disabled : ""
              }`}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  onClose();
                }
              }}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
              {item.shortcut && (
                <span className={styles.shortcut}>{item.shortcut}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContextMenu;
