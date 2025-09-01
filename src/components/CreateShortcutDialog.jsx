import React, { useState } from "react";
import styles from "./CreateShortcutDialog.module.css";

function CreateShortcutDialog({ visible, onCreateShortcut, onCancel }) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(
    "/icons8-visual-studio-code.svg"
  );
  const [content, setContent] = useState("");

  const availableIcons = [
    "/icons8-visual-studio-code.svg",
    "/icons8-google-chrome.svg",
    "/icons8-github.svg",
    "/notepad-icon.svg",
    "/calculator-icon.svg",
    "/file-explorer-icon.svg",
    "/icons8-windows-11.svg",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateShortcut(
        name.trim(),
        selectedIcon,
        content.trim() || "Custom application"
      );
      // Reset form
      setName("");
      setSelectedIcon("/icons8-visual-studio-code.svg");
      setContent("");
    }
  };

  const handleCancel = () => {
    // Reset form
    setName("");
    setSelectedIcon("/icons8-visual-studio-code.svg");
    setContent("");
    onCancel();
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h3>Create Shortcut</h3>
          <button className={styles.closeButton} onClick={handleCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="shortcut-name">Name:</label>
            <input
              id="shortcut-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter shortcut name"
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label>Icon:</label>
            <div className={styles.iconGrid}>
              {availableIcons.map((icon, index) => (
                <div
                  key={index}
                  className={`${styles.iconOption} ${
                    selectedIcon === icon ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  <img src={icon} alt={`Icon ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="shortcut-content">Description:</label>
            <input
              id="shortcut-content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.createButton}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateShortcutDialog;
