// src/components/StartMenu.jsx
import React, { useState, useEffect } from "react";
import styles from "./StartMenu.module.css"; // Use module CSS
import Icon from "./Icon";
import ContextMenu from "./ContextMenu";

function StartMenu({ onOpenApp, onCloseMenu, onCreateShortcut }) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetItem: null,
  });
  const startMenuItems = [
    {
      id: "notepad",
      name: "Notepad",
      image: "/notepad-icon.svg",
      type: "app",
      content: "Text Editor",
      app: "notepad", // Special identifier for app
    },
    {
      id: "calculator",
      name: "Calculator",
      image: "/calculator-icon.svg",
      type: "app",
      content: "Calculator",
      app: "calculator", // Special identifier for app
    },
    {
      id: "file-explorer",
      name: "File Explorer",
      image: "/file-explorer-icon.svg",
      type: "app",
      content: "File Manager",
      app: "file-explorer", // Special identifier for app
    },
    {
      id: "vscode",
      name: "VS Code",
      image: "/icons8-visual-studio-code.svg",
      type: "app",
      content: "VS Code Editor",
    },
    {
      id: "chrome",
      name: "Google Chrome",
      image: "/icons8-google-chrome.svg",
      type: "app",
      content: "Web Browser",
    },
    {
      id: "github",
      name: "Github Desktop",
      image: "/icons8-github.svg",
      type: "app",
      content: "github desktop app",
    },
  ];

  const handleAppClick = (item) => {
    if (item.app) {
      // For special apps, pass the app type
      onOpenApp(item.id, item.name, item.content, item.image, item.app);
    } else {
      // For regular apps
      onOpenApp(item.id, item.name, item.content, item.image);
    }
    onCloseMenu();
  };

  const handleRightClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetItem: item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      targetItem: null,
    });
  };

  const handleCreateShortcut = () => {
    if (contextMenu.targetItem && onCreateShortcut) {
      // Create a unique ID for the desktop shortcut
      const shortcutId = `${contextMenu.targetItem.id}-shortcut-${Date.now()}`;

      onCreateShortcut(
        contextMenu.targetItem.name,
        contextMenu.targetItem.image,
        contextMenu.targetItem.content,
        contextMenu.targetItem.app || null,
        shortcutId
      );
    }
    closeContextMenu();
  };

  const getContextMenuItems = () => [
    {
      icon: "🚀",
      label: "Open",
      action: () => {
        handleAppClick(contextMenu.targetItem);
        closeContextMenu();
      },
    },
    { type: "separator" },
    {
      icon: "🔗",
      label: "Create shortcut",
      action: handleCreateShortcut,
    },
  ];

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);
  return (
    <div className={styles.startMenu}>
      {/* 4. Add a grid container */}
      <div className={styles.menuGrid}>
        {startMenuItems.map((item) => (
          <Icon
            key={item.id}
            name={item.name}
            image={item.image}
            positioning="static"
            onClick={() => handleAppClick(item)}
            onRightClick={(e) => handleRightClick(e, item)}
          />
        ))}
      </div>

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={getContextMenuItems()}
        onClose={closeContextMenu}
      />
    </div>
  );
}

export default StartMenu;
