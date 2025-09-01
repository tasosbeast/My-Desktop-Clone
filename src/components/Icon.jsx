import React, { useState, useRef, useEffect } from "react";
import styles from "./Icon.module.css";

function Icon({
  name,
  image,
  onClick,
  onDoubleClick,
  onRightClick,
  isRenaming,
  onFinishRename,
  onCancelRename,
  // Position props
  x = 0,
  y = 0,
  // Layout mode - 'absolute' for desktop, 'static' for start menu
  positioning = "absolute",
  // Selection state
  isSelected = false,
  iconId,
  // Drag and drop props
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver = false,
  isDragging = false,
}) {
  const [editingName, setEditingName] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    setEditingName(name);
  }, [name]);

  const handleContextMenu = (e) => {
    if (onRightClick) {
      onRightClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onFinishRename(editingName);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingName(name);
      onCancelRename();
    }
  };

  const handleBlur = () => {
    onFinishRename(editingName);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.icon} ${isDragOver ? styles.dragOver : ""} ${
        isDragging ? styles.dragging : ""
      } ${isSelected ? styles.selected : ""} ${
        positioning === "static" ? styles.staticIcon : ""
      }`}
      style={{
        position: positioning,
        left: positioning === "absolute" ? x : undefined,
        top: positioning === "absolute" ? y : undefined,
        transform: isDragging ? "rotate(5deg)" : "none",
      }}
      data-icon-id={iconId}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={handleContextMenu}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <img src={image} alt={name} className={styles.iconImage} />
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={handleInputClick}
          className={styles.renameInput}
        />
      ) : (
        <span className={styles.iconName}>{name}</span>
      )}
    </div>
  );
}

export default Icon;
