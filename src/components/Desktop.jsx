import React, { useState } from "react";
import styles from "./Desktop.module.css";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Icon from "./Icon";
import Window from "./Window";
import ContextMenu from "./ContextMenu";

let nextZIndex = 1001;

function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    targetId: null,
  });
  const [renamingIcon, setRenamingIcon] = useState(null);
  const [desktopIcons, setDesktopIcons] = useState([
    {
      id: "recycle-bin",
      name: "Recycle Bin",
      image: "/recycle-bin.png",
      type: "system",
      content: "Deleted Items",
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
  ]);
  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev); // Toggle the state
  };

  const bringWindowToFront = (idToFocus) => {
    setActiveWindowId(idToFocus);
    setOpenWindows((prevWindows) => {
      // Find the window to bring to front
      const windowIndex = prevWindows.findIndex((win) => win.id === idToFocus);
      if (windowIndex === -1) return prevWindows; // Not found

      // Increment global z-index counter
      nextZIndex++;

      // Create a new array with updated z-indices
      const updatedWindows = prevWindows.map((win) => {
        if (win.id === idToFocus) {
          return { ...win, zIndex: nextZIndex }; // Assign new highest zIndex
        }
        return win;
      });

      return updatedWindows;
    });
  };

  const openWindow = (id, title, content, image) => {
    const existingWindow = openWindows.find((win) => win.id === id);

    if (existingWindow) {
      // Window already exists.
      // First, check if it's minimized and restore it if needed.
      if (existingWindow.status === "minimized") {
        minimizeWindow(id); // This toggles its status back to 'open'.
      }
      // Then, always bring it to the front.
      bringWindowToFront(id);
    } else {
      // Window does not exist, create a new one.
      nextZIndex++;
      setOpenWindows((prevWindows) => [
        ...prevWindows,
        {
          id: id,
          title: title,
          content: content,
          image: image,
          status: "open",
          x: 100 + prevWindows.length * 20,
          y: 100 + prevWindows.length * 20,
          width: 600,
          height: 400,
          zIndex: nextZIndex,
        },
      ]);
      setActiveWindowId(id);
    }
  };

  const closeWindow = (id) => {
    if (id === activeWindowId) {
      setActiveWindowId(null);
    }
    setOpenWindows((prevWindows) =>
      prevWindows.filter((window) => window.id !== id)
    );
  };

  const maximizeWindow = (id) => {
    setOpenWindows((prevWindows) =>
      prevWindows.map((win) => {
        if (win.id === id) {
          if (win.status === "maximized") {
            // Restore from maximized
            return {
              ...win,
              status: "open",
              x: win.prevX, // Restore previous position and size
              y: win.prevY,
              width: win.prevWidth,
              height: win.prevHeight,
            };
          } else {
            // Maximize the window
            return {
              ...win,
              status: "maximized",
              prevX: win.x, // Save current position and size
              prevY: win.y,
              prevWidth: win.width,
              prevHeight: win.height,
            };
          }
        }
        return win;
      })
    );
    // Ensure the maximized window is also the active one
    setActiveWindowId(id);
  };

  const minimizeWindow = (id) => {
    setOpenWindows((prevWindows) =>
      prevWindows.map((win) => {
        if (win.id === id) {
          // Toggle between minimized and open
          const newStatus = win.status === "minimized" ? "open" : "minimized";
          return { ...win, status: newStatus };
        }
        return win;
      })
    );
    // If we are minimizing the active window, clear the active ID
    if (id === activeWindowId) {
      setActiveWindowId(null);
    }
  };

  const updateWindowProps = (id, newX, newY, newWidth, newHeight) => {
    setOpenWindows((prevWindows) =>
      prevWindows.map((win) =>
        win.id === id
          ? { ...win, x: newX, y: newY, width: newWidth, height: newHeight }
          : win
      )
    );
  };

  const handleDesktopRightClick = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: "desktop",
      targetId: null,
    });
  };

  const handleIconRightClick = (e, iconId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: "icon",
      targetId: iconId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      type: null,
      targetId: null,
    });
  };

  const getDesktopContextMenuItems = () => [
    {
      icon: "🖼️",
      label: "Personalize",
      action: () => console.log("Personalize clicked"),
    },
    { type: "separator" },
    {
      icon: "📁",
      label: "New Folder",
      action: () => console.log("New folder clicked"),
    },
    {
      icon: "📄",
      label: "New Document",
      action: () => console.log("New document clicked"),
    },
    { type: "separator" },
    {
      icon: "🔄",
      label: "Refresh",
      shortcut: "F5",
      action: () => console.log("Refresh clicked"),
    },
  ];

  const getIconContextMenuItems = (iconId) => {
    const icon = desktopIcons.find((i) => i.id === iconId);
    return [
      {
        icon: "🚀",
        label: "Open",
        action: () => openWindow(icon.id, icon.name, icon.content, icon.image),
      },
      { type: "separator" },
      {
        icon: "✏️",
        label: "Rename",
        action: () => startRenaming(iconId),
      },
      {
        icon: "🗑️",
        label: "Delete",
        action: () => console.log(`Delete ${iconId}`),
      },
      { type: "separator" },
      {
        icon: "⚙️",
        label: "Properties",
        action: () => console.log(`Properties of ${iconId}`),
      },
    ];
  };

  const startRenaming = (iconId) => {
    setRenamingIcon(iconId);
  };

  const finishRenaming = (iconId, newName) => {
    if (newName.trim() && newName.trim() !== "") {
      setDesktopIcons((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, name: newName.trim() } : icon
        )
      );
    }
    setRenamingIcon(null);
  };

  const cancelRenaming = () => {
    setRenamingIcon(null);
  };
  return (
    <div className={styles.desktop} onContextMenu={handleDesktopRightClick}>
      <div className={styles.desktopIconsContainer}>
        {" "}
        {/* New container for icons */}
        {desktopIcons.map((icon) => (
          <Icon
            key={icon.id}
            name={icon.name}
            image={icon.image}
            onDoubleClick={() =>
              openWindow(icon.id, icon.name, icon.content, icon.image)
            }
            onRightClick={(e) => handleIconRightClick(e, icon.id)}
            isRenaming={renamingIcon === icon.id}
            onFinishRename={(newName) => finishRenaming(icon.id, newName)}
            onCancelRename={cancelRenaming}
          />
        ))}
      </div>

      {/* Render open windows */}
      {openWindows
        .filter((win) => win.status !== "minimized")
        .map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            initialX={window.x}
            initialY={window.y}
            initialWidth={window.width}
            initialHeight={window.height}
            initialZIndex={window.zIndex}
            onClose={closeWindow}
            onFocus={bringWindowToFront}
            onDragStop={updateWindowProps}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            status={window.status}
          >
            {window.content} {/* Pass content as children */}
          </Window>
        ))}

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={
          contextMenu.type === "desktop"
            ? getDesktopContextMenuItems()
            : contextMenu.type === "icon"
            ? getIconContextMenuItems(contextMenu.targetId)
            : []
        }
        onClose={closeContextMenu}
      />

      {isStartMenuOpen && (
        <StartMenu onOpenApp={openWindow} onCloseMenu={toggleStartMenu} />
      )}
      <Taskbar
        onStartButtonClick={toggleStartMenu}
        openWindows={openWindows}
        onFocus={bringWindowToFront}
        activeWindowId={activeWindowId}
        onMinimize={minimizeWindow}
      />
    </div>
  );
}

export default Desktop;
