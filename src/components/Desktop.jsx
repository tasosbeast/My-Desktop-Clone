import React, { useState, useEffect } from "react";
import styles from "./Desktop.module.css";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Icon from "./Icon";
import Window from "./Window";
import ContextMenu from "./ContextMenu";
import WallpaperSelector from "./WallpaperSelector";
import CreateShortcutDialog from "./CreateShortcutDialog";
import Notepad from "./Notepad";
import RecycleBin from "./RecycleBin";

let nextZIndex = 1001;

// Default wallpaper
const defaultWallpaper = {
  id: "default",
  name: "Windows 11 Default",
  image: "/Windows-11-bg.webp",
};

// Function to load wallpaper from localStorage
const loadWallpaper = () => {
  try {
    const saved = localStorage.getItem("desktopWallpaper");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading wallpaper:", error);
  }
  return defaultWallpaper;
};

// Function to save wallpaper to localStorage
const saveWallpaper = (wallpaper) => {
  try {
    localStorage.setItem("desktopWallpaper", JSON.stringify(wallpaper));
  } catch (error) {
    console.error("Error saving wallpaper:", error);
  }
};

// Default desktop icons
const defaultDesktopIcons = [
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    image: "/recycle-bin.png",
    type: "system",
    content: "Deleted Items",
  },
  {
    id: "notepad",
    name: "Notepad",
    image: "/icons8-windows-11.svg", // Using Windows icon as placeholder
    type: "app",
    content: "Text Editor",
    app: "notepad", // Special identifier for app
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

// Function to load desktop icons from localStorage
const loadDesktopIcons = () => {
  try {
    const saved = localStorage.getItem("desktopIcons");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we always have the system icons
      const systemIcons = defaultDesktopIcons.filter(
        (icon) => icon.type === "system"
      );
      const savedNonSystemIcons = parsed.filter(
        (icon) => icon.type !== "system"
      );

      // Merge system icons with saved icons, updating system icon names if they were renamed
      const mergedIcons = systemIcons.map((systemIcon) => {
        const savedVersion = parsed.find((saved) => saved.id === systemIcon.id);
        return savedVersion
          ? { ...systemIcon, name: savedVersion.name }
          : systemIcon;
      });

      return [...mergedIcons, ...savedNonSystemIcons];
    }
  } catch (error) {
    console.error("Error loading desktop icons:", error);
  }
  return defaultDesktopIcons;
};

// Function to save desktop icons to localStorage
const saveDesktopIcons = (icons) => {
  try {
    localStorage.setItem("desktopIcons", JSON.stringify(icons));
  } catch (error) {
    console.error("Error saving desktop icons:", error);
  }
};

// Function to load recycle bin from localStorage
const loadRecycleBin = () => {
  try {
    const saved = localStorage.getItem("recycleBin");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading recycle bin:", error);
  }
  return [];
};

// Function to save recycle bin to localStorage
const saveRecycleBin = (items) => {
  try {
    localStorage.setItem("recycleBin", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving recycle bin:", error);
  }
};

function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [desktopVisible, setDesktopVisible] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    targetId: null,
  });
  const [renamingIcon, setRenamingIcon] = useState(null);
  const [currentWallpaper, setCurrentWallpaper] = useState(() =>
    loadWallpaper()
  );
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [showCreateShortcut, setShowCreateShortcut] = useState(false);
  const [desktopIcons, setDesktopIcons] = useState(() => loadDesktopIcons());
  const [recycleBinItems, setRecycleBinItems] = useState(() =>
    loadRecycleBin()
  );
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  // Save wallpaper to localStorage whenever it changes
  useEffect(() => {
    saveWallpaper(currentWallpaper);
  }, [currentWallpaper]);

  // Save desktop icons to localStorage whenever they change
  useEffect(() => {
    saveDesktopIcons(desktopIcons);
  }, [desktopIcons]);

  // Save recycle bin to localStorage whenever it changes
  useEffect(() => {
    saveRecycleBin(recycleBinItems);
  }, [recycleBinItems]);

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

  const openWindow = (id, title, content, image, appType) => {
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

      // Set different sizes based on app type
      let windowConfig = {
        width: 600,
        height: 400,
      };

      if (appType === "notepad") {
        windowConfig = {
          width: 800,
          height: 600,
        };
      }

      setOpenWindows((prevWindows) => [
        ...prevWindows,
        {
          id: id,
          title: title,
          content: content,
          image: image,
          appType: appType, // Store the app type
          status: "open",
          x: 100 + prevWindows.length * 20,
          y: 100 + prevWindows.length * 20,
          width: windowConfig.width,
          height: windowConfig.height,
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

  const handleShowDesktop = () => {
    if (desktopVisible) {
      // Hide all windows (minimize them)
      setOpenWindows((prevWindows) =>
        prevWindows.map((win) => ({
          ...win,
          status:
            win.status === "open" || win.status === "maximized"
              ? "minimized"
              : win.status,
        }))
      );
      setActiveWindowId(null);
      setDesktopVisible(false);
    } else {
      // Restore all previously minimized windows
      setOpenWindows((prevWindows) =>
        prevWindows.map((win) => ({
          ...win,
          status: win.status === "minimized" ? "open" : win.status,
        }))
      );
      setDesktopVisible(true);
    }
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

  const handleDesktopClick = (e) => {
    // Close start menu if clicking outside it
    if (isStartMenuOpen) {
      setIsStartMenuOpen(false);
    }

    // Close context menu if clicking outside it
    if (contextMenu.visible) {
      closeContextMenu();
    }

    // If desktop is not visible (windows were minimized), restore them
    if (!desktopVisible) {
      setDesktopVisible(true);
    }
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
      label: "Change Wallpaper",
      action: () => {
        closeContextMenu();
        setShowWallpaperSelector(true);
      },
    },
    { type: "separator" },
    {
      icon: "➕",
      label: "New Shortcut",
      action: () => {
        closeContextMenu();
        setShowCreateShortcut(true);
      },
    },
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
        action: () => {
          closeContextMenu();
          openWindow(icon.id, icon.name, icon.content, icon.image);
        },
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
        action: () => deleteIcon(iconId),
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
    closeContextMenu();
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

  const handleWallpaperSelect = (wallpaper) => {
    setCurrentWallpaper(wallpaper);
  };

  const createNewShortcut = (name, icon, content) => {
    const newShortcut = {
      id: Date.now().toString(),
      name: name,
      image: icon,
      type: "shortcut",
      content: content || `Shortcut to ${name}`,
      action: "custom", // Add an action type for custom shortcuts
    };
    setDesktopIcons([...desktopIcons, newShortcut]);
    setShowCreateShortcut(false);
  };

  const createShortcutFromStartMenu = (
    name,
    icon,
    content,
    appType,
    shortcutId
  ) => {
    const newShortcut = {
      id: shortcutId || Date.now().toString(),
      name: name,
      image: icon,
      type: "shortcut",
      content: content || `Shortcut to ${name}`,
      action: "custom",
      app: appType, // Preserve the app type for special apps
    };
    setDesktopIcons([...desktopIcons, newShortcut]);
  };

  const deleteIcon = (iconId) => {
    const iconToDelete = desktopIcons.find((icon) => icon.id === iconId);

    // Prevent deletion of system icons
    if (iconToDelete && iconToDelete.type === "system") {
      alert("System icons cannot be deleted.");
      closeContextMenu();
      return;
    }

    if (iconToDelete) {
      // Add deleted item to recycle bin with timestamp
      const recycleBinItem = {
        ...iconToDelete,
        deletedAt: new Date().toISOString(),
        originalLocation: "Desktop",
      };

      setRecycleBinItems((prevItems) => [...prevItems, recycleBinItem]);

      // Remove from desktop icons
      setDesktopIcons((prevIcons) =>
        prevIcons.filter((icon) => icon.id !== iconId)
      );
    }

    closeContextMenu();
  };

  const restoreFromRecycleBin = (itemId) => {
    const itemToRestore = recycleBinItems.find((item) => item.id === itemId);

    if (itemToRestore) {
      // Remove from recycle bin
      setRecycleBinItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );

      // Add back to desktop icons
      const restoredItem = {
        id: itemToRestore.id,
        name: itemToRestore.name,
        image: itemToRestore.image,
        type: itemToRestore.type,
        content: itemToRestore.content,
        action: itemToRestore.action,
        app: itemToRestore.app,
      };

      setDesktopIcons((prevIcons) => [...prevIcons, restoredItem]);
    }
  };

  const permanentDeleteFromRecycleBin = (itemId) => {
    setRecycleBinItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const emptyRecycleBin = () => {
    setRecycleBinItems([]);
  };

  const openRecycleBin = () => {
    setShowRecycleBin(true);
  };

  const getDesktopStyle = () => {
    const baseStyle = {
      width: "100%",
      height: "100%",
      position: "relative",
    };

    if (currentWallpaper.image) {
      return {
        ...baseStyle,
        backgroundImage: `url(${currentWallpaper.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    } else if (currentWallpaper.gradient) {
      return {
        ...baseStyle,
        background: currentWallpaper.gradient,
      };
    } else if (currentWallpaper.color) {
      return {
        ...baseStyle,
        backgroundColor: currentWallpaper.color,
      };
    }
    return baseStyle;
  };

  return (
    <div
      style={getDesktopStyle()}
      onContextMenu={handleDesktopRightClick}
      onClick={handleDesktopClick}
    >
      <div className={styles.desktopIconsContainer}>
        {" "}
        {/* New container for icons */}
        {desktopIcons.map((icon) => (
          <Icon
            key={icon.id}
            name={
              icon.id === "recycle-bin"
                ? `Recycle Bin${
                    recycleBinItems.length > 0
                      ? ` (${recycleBinItems.length})`
                      : ""
                  }`
                : icon.name
            }
            image={icon.image}
            onDoubleClick={() => {
              if (icon.id === "recycle-bin") {
                // Special handling for recycle bin
                openRecycleBin();
              } else if (icon.type === "shortcut" && icon.action === "custom") {
                // For custom shortcuts, check if they have an app type
                if (icon.app) {
                  // For app shortcuts, pass the app type
                  openWindow(
                    icon.id,
                    icon.name,
                    icon.content,
                    icon.image,
                    icon.app
                  );
                } else {
                  // For regular custom shortcuts, show enhanced window
                  const enhancedContent = `Custom Shortcut: ${icon.name} - ${icon.content}`;
                  openWindow(icon.id, icon.name, enhancedContent, icon.image);
                }
              } else if (icon.app) {
                // For special apps, pass the app type
                openWindow(
                  icon.id,
                  icon.name,
                  icon.content,
                  icon.image,
                  icon.app
                );
              } else {
                // For regular icons, use the default behavior
                openWindow(icon.id, icon.name, icon.content, icon.image);
              }
            }}
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
            {window.appType === "notepad" ? (
              <Notepad
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onMaximize={() => maximizeWindow(window.id)}
                isMaximized={window.status === "maximized"}
              />
            ) : (
              window.content
            )}
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
        <StartMenu
          onOpenApp={openWindow}
          onCloseMenu={toggleStartMenu}
          onCreateShortcut={createShortcutFromStartMenu}
        />
      )}
      <Taskbar
        onStartButtonClick={toggleStartMenu}
        openWindows={openWindows}
        onFocus={bringWindowToFront}
        activeWindowId={activeWindowId}
        onMinimize={minimizeWindow}
        onShowDesktop={handleShowDesktop}
      />

      {/* Wallpaper Selector */}
      <WallpaperSelector
        isOpen={showWallpaperSelector}
        onClose={() => setShowWallpaperSelector(false)}
        onSelectWallpaper={handleWallpaperSelect}
        currentWallpaper={currentWallpaper}
      />

      {/* Create Shortcut Dialog */}
      <CreateShortcutDialog
        visible={showCreateShortcut}
        onCreateShortcut={createNewShortcut}
        onCancel={() => setShowCreateShortcut(false)}
      />

      {/* Recycle Bin */}
      <RecycleBin
        isOpen={showRecycleBin}
        onClose={() => setShowRecycleBin(false)}
        recycleBinItems={recycleBinItems}
        onRestoreItem={restoreFromRecycleBin}
        onPermanentDelete={permanentDeleteFromRecycleBin}
        onEmptyRecycleBin={emptyRecycleBin}
      />
    </div>
  );
}

export default Desktop;
