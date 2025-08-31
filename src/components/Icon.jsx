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
      className={styles.icon}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={handleContextMenu}
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
