import React, { useState, useEffect } from "react";
import styles from "./FileExplorer.module.css";

// Mock file system structure
const mockFileSystem = {
  "C:\\": {
    type: "drive",
    children: {
      Users: {
        type: "folder",
        children: {
          User: {
            type: "folder",
            children: {
              Documents: {
                type: "folder",
                children: {
                  "My Document.txt": {
                    type: "file",
                    size: "1.2 KB",
                    modified: "2025-09-01 10:30",
                  },
                  "Important Notes.docx": {
                    type: "file",
                    size: "245 KB",
                    modified: "2025-08-30 14:15",
                  },
                  Projects: {
                    type: "folder",
                    children: {
                      "My-Desktop-Clone": {
                        type: "folder",
                        children: {
                          "README.md": {
                            type: "file",
                            size: "3.1 KB",
                            modified: "2025-09-01 09:00",
                          },
                          "package.json": {
                            type: "file",
                            size: "1.8 KB",
                            modified: "2025-08-29 16:45",
                          },
                        },
                      },
                    },
                  },
                },
              },
              Downloads: {
                type: "folder",
                children: {
                  "image.jpg": {
                    type: "file",
                    size: "2.5 MB",
                    modified: "2025-08-28 11:20",
                  },
                  "setup.exe": {
                    type: "file",
                    size: "145 MB",
                    modified: "2025-08-27 09:15",
                  },
                },
              },
              Desktop: {
                type: "folder",
                children: {
                  "Shortcut.lnk": {
                    type: "file",
                    size: "1 KB",
                    modified: "2025-09-01 08:00",
                  },
                },
              },
              Pictures: {
                type: "folder",
                children: {
                  "vacation.png": {
                    type: "file",
                    size: "5.2 MB",
                    modified: "2025-08-25 19:30",
                  },
                  "screenshot.png": {
                    type: "file",
                    size: "892 KB",
                    modified: "2025-08-31 12:45",
                  },
                },
              },
            },
          },
        },
      },
      "Program Files": {
        type: "folder",
        children: {
          "Windows Security": { type: "folder", children: {} },
          "Microsoft Office": { type: "folder", children: {} },
        },
      },
      Windows: {
        type: "folder",
        children: {
          System32: { type: "folder", children: {} },
        },
      },
    },
  },
};

const FileExplorer = ({ onClose, onMinimize, onMaximize, isMaximized }) => {
  const [currentPath, setCurrentPath] = useState("C:\\Users\\User");
  const [files, setFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, icons, details

  const getFileIcon = (fileName, type) => {
    if (type === "folder") return "📁";
    if (type === "drive") return "💾";

    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "txt":
        return "📄";
      case "docx":
      case "doc":
        return "📘";
      case "pdf":
        return "📕";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp3":
      case "wav":
        return "🎵";
      case "mp4":
      case "avi":
        return "🎬";
      case "exe":
        return "⚙️";
      case "zip":
      case "rar":
        return "📦";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return "📜";
      case "json":
        return "🔧";
      case "md":
        return "📋";
      default:
        return "📄";
    }
  };

  const loadCurrentDirectory = React.useCallback(() => {
    const pathParts = currentPath.split("\\").filter(Boolean);
    let current = mockFileSystem;

    for (const part of pathParts) {
      if (current[part] && current[part].children) {
        current = current[part].children;
      } else {
        current = {};
        break;
      }
    }

    const items = Object.entries(current).map(([name, item]) => ({
      name,
      type: item.type,
      size: item.size || (item.type === "folder" ? "--" : "0 KB"),
      modified: item.modified || "Unknown",
      icon: getFileIcon(name, item.type),
    }));

    setFiles(items);
  }, [currentPath]);

  useEffect(() => {
    loadCurrentDirectory();
  }, [loadCurrentDirectory]);

  const navigateUp = () => {
    const pathParts = currentPath.split("\\");
    if (pathParts.length > 1) {
      pathParts.pop();
      setCurrentPath(pathParts.join("\\") || "C:\\");
    }
  };

  const navigateToPath = (path) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === "folder" || item.type === "drive") {
      const newPath =
        currentPath === "C:\\"
          ? `C:\\${item.name}`
          : `${currentPath}\\${item.name}`;
      navigateToPath(newPath);
    } else {
      // Open file (placeholder action)
      alert(`Opening ${item.name}...`);
    }
  };

  const handleItemClick = (item, event) => {
    if (event.ctrlKey) {
      setSelectedItems((prev) =>
        prev.includes(item.name)
          ? prev.filter((name) => name !== item.name)
          : [...prev, item.name]
      );
    } else {
      setSelectedItems([item.name]);
    }
  };

  const getAddressBarParts = () => {
    return currentPath.split("\\").filter(Boolean);
  };

  const navigateToAddressPart = (index) => {
    const parts = getAddressBarParts();
    const newPath = parts.slice(0, index + 1).join("\\");
    navigateToPath(newPath || "C:\\");
  };

  const quickAccessItems = [
    { name: "Desktop", path: "C:\\Users\\User\\Desktop", icon: "🖥️" },
    { name: "Documents", path: "C:\\Users\\User\\Documents", icon: "📁" },
    { name: "Downloads", path: "C:\\Users\\User\\Downloads", icon: "⬇️" },
    { name: "Pictures", path: "C:\\Users\\User\\Pictures", icon: "🖼️" },
    { name: "This PC", path: "C:\\", icon: "💻" },
  ];

  return (
    <div className={styles.fileExplorer}>
      {/* Title Bar */}
      <div className={styles.titleBar}>
        <div className={styles.titleContent}>
          <span className={styles.icon}>📁</span>
          <span className={styles.title}>File Explorer</span>
        </div>
        <div className={styles.windowControls}>
          <button
            className={styles.minimizeBtn}
            onClick={onMinimize}
            title="Minimize"
          >
            ─
          </button>
          <button
            className={styles.maximizeBtn}
            onClick={onMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? "⧉" : "□"}
          </button>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className={styles.menuBar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>Edit</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Tools</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.navigationButtons}>
          <button
            className={styles.navBtn}
            onClick={navigateUp}
            disabled={currentPath === "C:\\"}
            title="Up"
          >
            ⬆️
          </button>
          <button className={styles.navBtn} title="Back">
            ⬅️
          </button>
          <button className={styles.navBtn} title="Forward">
            ➡️
          </button>
          <button
            className={styles.navBtn}
            onClick={loadCurrentDirectory}
            title="Refresh"
          >
            🔄
          </button>
        </div>

        <div className={styles.addressBar}>
          <span className={styles.addressIcon}>📍</span>
          <div className={styles.addressPath}>
            {getAddressBarParts().map((part, index) => (
              <React.Fragment key={index}>
                <button
                  className={styles.pathSegment}
                  onClick={() => navigateToAddressPart(index)}
                >
                  {part}
                </button>
                {index < getAddressBarParts().length - 1 && (
                  <span className={styles.pathSeparator}>›</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={styles.viewControls}>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "list" ? styles.active : ""
            }`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            ☰
          </button>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "icons" ? styles.active : ""
            }`}
            onClick={() => setViewMode("icons")}
            title="Icon View"
          >
            ⚏
          </button>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "details" ? styles.active : ""
            }`}
            onClick={() => setViewMode("details")}
            title="Details View"
          >
            ≣
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Quick access</h3>
            {quickAccessItems.map((item) => (
              <button
                key={item.name}
                className={`${styles.sidebarItem} ${
                  currentPath === item.path ? styles.active : ""
                }`}
                onClick={() => navigateToPath(item.path)}
              >
                <span className={styles.sidebarIcon}>{item.icon}</span>
                <span className={styles.sidebarLabel}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className={styles.fileList}>
          {viewMode === "details" && (
            <div className={styles.listHeader}>
              <div className={styles.columnHeader} style={{ width: "40%" }}>
                Name
              </div>
              <div className={styles.columnHeader} style={{ width: "20%" }}>
                Date modified
              </div>
              <div className={styles.columnHeader} style={{ width: "15%" }}>
                Type
              </div>
              <div className={styles.columnHeader} style={{ width: "15%" }}>
                Size
              </div>
            </div>
          )}

          <div className={`${styles.fileItems} ${styles[viewMode]}`}>
            {files.map((file) => (
              <div
                key={file.name}
                className={`${styles.fileItem} ${
                  selectedItems.includes(file.name) ? styles.selected : ""
                }`}
                onClick={(e) => handleItemClick(file, e)}
                onDoubleClick={() => handleItemDoubleClick(file)}
              >
                <div className={styles.fileIcon}>{file.icon}</div>
                <div className={styles.fileName}>{file.name}</div>
                {viewMode === "details" && (
                  <>
                    <div className={styles.fileModified}>{file.modified}</div>
                    <div className={styles.fileType}>{file.type}</div>
                    <div className={styles.fileSize}>{file.size}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <span className={styles.itemCount}>
          {files.length} items{" "}
          {selectedItems.length > 0 && `(${selectedItems.length} selected)`}
        </span>
        <span className={styles.pathInfo}>{currentPath}</span>
      </div>
    </div>
  );
};

export default FileExplorer;
