import React, { useState, useRef, useEffect } from "react";
import styles from "./Notepad.module.css";

export default function Notepad({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
}) {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("Untitled");
  const [isModified, setIsModified] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle content changes
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  // File operations
  const handleNew = () => {
    if (isModified) {
      const save = window.confirm(
        "Do you want to save changes to " + fileName + "?"
      );
      if (save) {
        handleSave();
      }
    }
    setContent("");
    setFileName("Untitled");
    setIsModified(false);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
        setFileName(file.name);
        setIsModified(false);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.endsWith(".txt") ? fileName : fileName + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleSaveAs = () => {
    const newFileName = prompt("Save as:", fileName);
    if (newFileName) {
      setFileName(newFileName);
      handleSave();
    }
  };

  // Edit operations
  const handleUndo = () => {
    document.execCommand("undo");
  };

  const handleRedo = () => {
    document.execCommand("redo");
  };

  const handleCut = () => {
    textareaRef.current?.focus();
    document.execCommand("cut");
  };

  const handleCopy = () => {
    textareaRef.current?.focus();
    document.execCommand("copy");
  };

  const handlePaste = () => {
    textareaRef.current?.focus();
    document.execCommand("paste");
  };

  const handleSelectAll = () => {
    textareaRef.current?.select();
  };

  const handleFind = () => {
    const searchTerm = prompt("Find:");
    if (searchTerm) {
      const textarea = textareaRef.current;
      const text = textarea.value;
      const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());

      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + searchTerm.length);
      } else {
        alert("Text not found.");
      }
    }
  };

  // Format operations
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  const toggleWordWrap = () => {
    setWordWrap(!wordWrap);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            handleNew();
            break;
          case "o":
            e.preventDefault();
            handleOpen();
            break;
          case "s":
            e.preventDefault();
            if (e.shiftKey) {
              handleSaveAs();
            } else {
              handleSave();
            }
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case "a":
            e.preventDefault();
            handleSelectAll();
            break;
          case "f":
            e.preventDefault();
            handleFind();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModified, fileName, content]);

  // Close menu dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
      setShowFormatMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.notepad}>
      {/* Menu Bar */}
      <div className={styles.menuBar}>
        <div
          className={styles.menuItem}
          onClick={(e) => {
            e.stopPropagation();
            setShowFileMenu(!showFileMenu);
            setShowEditMenu(false);
            setShowFormatMenu(false);
          }}
        >
          File
          {showFileMenu && (
            <div className={styles.dropdown}>
              <div className={styles.menuOption} onClick={handleNew}>
                New <span className={styles.shortcut}>Ctrl+N</span>
              </div>
              <div className={styles.menuOption} onClick={handleOpen}>
                Open <span className={styles.shortcut}>Ctrl+O</span>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.menuOption} onClick={handleSave}>
                Save <span className={styles.shortcut}>Ctrl+S</span>
              </div>
              <div className={styles.menuOption} onClick={handleSaveAs}>
                Save As <span className={styles.shortcut}>Ctrl+Shift+S</span>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.menuOption} onClick={onClose}>
                Exit
              </div>
            </div>
          )}
        </div>

        <div
          className={styles.menuItem}
          onClick={(e) => {
            e.stopPropagation();
            setShowEditMenu(!showEditMenu);
            setShowFileMenu(false);
            setShowFormatMenu(false);
          }}
        >
          Edit
          {showEditMenu && (
            <div className={styles.dropdown}>
              <div className={styles.menuOption} onClick={handleUndo}>
                Undo <span className={styles.shortcut}>Ctrl+Z</span>
              </div>
              <div className={styles.menuOption} onClick={handleRedo}>
                Redo <span className={styles.shortcut}>Ctrl+Shift+Z</span>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.menuOption} onClick={handleCut}>
                Cut <span className={styles.shortcut}>Ctrl+X</span>
              </div>
              <div className={styles.menuOption} onClick={handleCopy}>
                Copy <span className={styles.shortcut}>Ctrl+C</span>
              </div>
              <div className={styles.menuOption} onClick={handlePaste}>
                Paste <span className={styles.shortcut}>Ctrl+V</span>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.menuOption} onClick={handleSelectAll}>
                Select All <span className={styles.shortcut}>Ctrl+A</span>
              </div>
              <div className={styles.menuOption} onClick={handleFind}>
                Find <span className={styles.shortcut}>Ctrl+F</span>
              </div>
            </div>
          )}
        </div>

        <div
          className={styles.menuItem}
          onClick={(e) => {
            e.stopPropagation();
            setShowFormatMenu(!showFormatMenu);
            setShowFileMenu(false);
            setShowEditMenu(false);
          }}
        >
          Format
          {showFormatMenu && (
            <div className={styles.dropdown}>
              <div className={styles.menuOption} onClick={toggleWordWrap}>
                Word Wrap {wordWrap ? "✓" : ""}
              </div>
              <div className={styles.separator}></div>
              <div className={styles.submenu}>
                Font Size
                <div className={styles.submenuDropdown}>
                  {[10, 12, 14, 16, 18, 20, 24].map((size) => (
                    <div
                      key={size}
                      className={styles.menuOption}
                      onClick={() => handleFontSizeChange(size)}
                    >
                      {size}px {fontSize === size ? "✓" : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        className={styles.textArea}
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
        style={{
          fontSize: `${fontSize}px`,
          whiteSpace: wordWrap ? "pre-wrap" : "pre",
          wordWrap: wordWrap ? "break-word" : "normal",
          overflowX: wordWrap ? "hidden" : "auto",
        }}
      />

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          {isModified ? "Modified" : "Saved"} | {fileName}
        </div>
        <div className={styles.statusRight}>
          Lines: {content.split("\n").length} | Characters: {content.length}
        </div>
      </div>

      {/* Hidden file input for opening files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.text"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
}
