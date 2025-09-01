import React, { useState, useEffect, useRef } from "react";
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
import Calculator from "./Calculator";
import FileExplorer from "./FileExplorer";

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

// Default desktop icons with grid-aligned positions
const defaultDesktopIcons = [
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    image: "/recycle-bin.png",
    type: "system",
    content: "Deleted Items",
    x: 20,
    y: 20,
  },
  {
    id: "notepad",
    name: "Notepad",
    image: "/notepad-icon.svg",
    type: "app",
    content: "Text Editor",
    app: "notepad", // Special identifier for app
    x: 20,
    y: 120,
  },
  {
    id: "calculator",
    name: "Calculator",
    image: "/calculator-icon.svg",
    type: "app",
    content: "Calculator",
    app: "calculator", // Special identifier for app
    x: 20,
    y: 220,
  },
  {
    id: "file-explorer",
    name: "File Explorer",
    image: "/file-explorer-icon.svg",
    type: "app",
    content: "File Manager",
    app: "file-explorer", // Special identifier for app
    x: 20,
    y: 320,
  },
  {
    id: "vscode",
    name: "VS Code",
    image: "/icons8-visual-studio-code.svg",
    type: "app",
    content: "VS Code Editor",
    x: 20,
    y: 420,
  },
  {
    id: "chrome",
    name: "Google Chrome",
    image: "/icons8-google-chrome.svg",
    type: "app",
    content: "Web Browser",
    x: 20,
    y: 520,
  },
  {
    id: "github",
    name: "Github Desktop",
    image: "/icons8-github.svg",
    type: "app",
    content: "github desktop app",
    x: 20,
    y: 620,
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
          ? {
              ...systemIcon,
              name: savedVersion.name,
              x: savedVersion.x || systemIcon.x,
              y: savedVersion.y || systemIcon.y,
            }
          : systemIcon;
      });

      // Add default grid-aligned positions to saved icons that don't have them
      const positionedSavedIcons = savedNonSystemIcons.map((icon, index) => {
        if (icon.x === undefined || icon.y === undefined) {
          // Calculate default grid-aligned position based on index
          const gridSize = 100;
          const padding = 20;
          const defaultX = padding;
          const defaultY = padding + (index + systemIcons.length) * gridSize;
          return { ...icon, x: defaultX, y: defaultY };
        }
        return icon;
      });

      return [...mergedIcons, ...positionedSavedIcons];
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

  // Drag and drop state
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  // Multi-selection state
  const [selectedIcons, setSelectedIcons] = useState(new Set());
  const [isBoxSelecting, setIsBoxSelecting] = useState(false);
  const [justFinishedBoxSelection, setJustFinishedBoxSelection] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const selectionBoxRef = useRef({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

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

  // Debug: Track selected icons changes
  useEffect(() => {
    console.log("selectedIcons changed:", Array.from(selectedIcons));
  }, [selectedIcons]);

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
      } else if (appType === "calculator") {
        windowConfig = {
          width: 400,
          height: 500,
        };
      } else if (appType === "file-explorer") {
        windowConfig = {
          width: 900,
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
    console.log("handleDesktopClick triggered, isBoxSelecting:", isBoxSelecting, "justFinished:", justFinishedBoxSelection);
    
    // Don't process click if we just finished a box selection
    if (justFinishedBoxSelection) {
      console.log("Ignoring click - just finished box selection");
      return;
    }
    
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

    // Don't clear selection if we're box selecting or if it's an icon click
    const clickedOnIcon = e.target.closest("[data-icon-id]");
    
    console.log("Desktop click - should clear selection?", {
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      clickedOnIcon: !!clickedOnIcon,
      isBoxSelecting,
      willClear: !e.ctrlKey && !e.metaKey && !clickedOnIcon && !isBoxSelecting
    });
    
    // Clear selection if clicking on empty space (not Ctrl+click) and not on an icon
    if (!e.ctrlKey && !e.metaKey && !clickedOnIcon && !isBoxSelecting) {
      console.log("Clearing selection");
      setSelectedIcons(new Set());
    }
  };

  // Box selection handlers
  const handleMouseDown = (e) => {
    console.log("handleMouseDown triggered", e.target);
    
    // Only start box selection if clicking on empty desktop space
    const isDesktopSpace =
      e.target.getAttribute("data-desktop-container") === "true" ||
      e.target.classList.contains(styles.gridOverlay) ||
      e.target.classList.contains(styles.desktopIconsContainer) ||
      e.target === e.currentTarget;

    // Also check that we didn't click on an icon
    const clickedOnIcon = e.target.closest("[data-icon-id]");

    console.log("Box selection check:", {
      isDesktopSpace,
      clickedOnIcon: !!clickedOnIcon,
      shouldStart: isDesktopSpace && !clickedOnIcon
    });

    if (isDesktopSpace && !clickedOnIcon) {
      e.preventDefault(); // Prevent text selection
      const rect = e.currentTarget.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      console.log("Starting box selection at:", { startX, startY });

      // Update both state and ref
      const newBox = {
        startX,
        startY,
        endX: startX,
        endY: startY,
      };
      
      setIsBoxSelecting(true);
      setSelectionBox(newBox);
      selectionBoxRef.current = newBox;

      // Clear previous selection if not holding Ctrl
      if (!e.ctrlKey && !e.metaKey) {
        setSelectedIcons(new Set());
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isBoxSelecting) {
      console.log("handleMouseMove during box selection");
      const rect = e.currentTarget.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      // Update ref immediately
      selectionBoxRef.current = {
        ...selectionBoxRef.current,
        endX,
        endY,
      };

      // Update state for rendering
      setSelectionBox(prev => ({
        ...prev,
        endX,
        endY,
      }));

      // Calculate which icons are in the selection box using ref values
      const boxLeft = Math.min(selectionBoxRef.current.startX, endX);
      const boxTop = Math.min(selectionBoxRef.current.startY, endY);
      const boxRight = Math.max(selectionBoxRef.current.startX, endX);
      const boxBottom = Math.max(selectionBoxRef.current.startY, endY);

      const iconsInBox = new Set();
      desktopIcons.forEach((icon) => {
        const iconLeft = icon.x || 0;
        const iconTop = icon.y || 0;
        const iconRight = iconLeft + 80; // Icon width
        const iconBottom = iconTop + 80; // Icon height

        // Check if icon overlaps with selection box
        if (
          iconLeft < boxRight &&
          iconRight > boxLeft &&
          iconTop < boxBottom &&
          iconBottom > boxTop
        ) {
          iconsInBox.add(icon.id);
        }
      });

      console.log("Icons in box during move:", Array.from(iconsInBox));

      // Update selected icons during drag for visual feedback
      setSelectedIcons(prev => {
        if (e.ctrlKey || e.metaKey) {
          const newSet = new Set(prev);
          iconsInBox.forEach(id => newSet.add(id));
          return newSet;
        } else {
          return iconsInBox;
        }
      });
    }
  };

  const handleMouseUp = (e) => {
    console.log("handleMouseUp triggered, isBoxSelecting:", isBoxSelecting);
    
    if (isBoxSelecting) {
      console.log("Ending box selection");
      
      // Use ref values for final calculation to avoid stale state
      const boxLeft = Math.min(selectionBoxRef.current.startX, selectionBoxRef.current.endX);
      const boxTop = Math.min(selectionBoxRef.current.startY, selectionBoxRef.current.endY);
      const boxRight = Math.max(selectionBoxRef.current.startX, selectionBoxRef.current.endX);
      const boxBottom = Math.max(selectionBoxRef.current.startY, selectionBoxRef.current.endY);

      const iconsInBox = new Set();
      desktopIcons.forEach((icon) => {
        const iconLeft = icon.x || 0;
        const iconTop = icon.y || 0;
        const iconRight = iconLeft + 80; // Icon width
        const iconBottom = iconTop + 80; // Icon height

        // Check if icon overlaps with selection box
        if (
          iconLeft < boxRight &&
          iconRight > boxLeft &&
          iconTop < boxBottom &&
          iconBottom > boxTop
        ) {
          iconsInBox.add(icon.id);
        }
      });

      console.log("Final selected icons:", Array.from(iconsInBox));
      
      // If Ctrl is held, add to existing selection, otherwise replace
      if (e.ctrlKey || e.metaKey) {
        setSelectedIcons(prev => {
          const newSet = new Set(prev);
          iconsInBox.forEach(id => newSet.add(id));
          return newSet;
        });
      } else {
        setSelectedIcons(iconsInBox);
      }

      setIsBoxSelecting(false);
      setJustFinishedBoxSelection(true);
      
      // Clear the flag after a short delay to prevent click interference
      setTimeout(() => {
        setJustFinishedBoxSelection(false);
      }, 10);
    }
  };

  // Drag and drop handlers for free positioning
  const handleIconDragStart = (e, iconId, index) => {
    const icon = desktopIcons[index];

    // If this icon isn't selected, select only this icon
    if (!selectedIcons.has(iconId)) {
      setSelectedIcons(new Set([iconId]));
    }

    // Get the icon's current position relative to the drag point
    const iconRect = e.currentTarget.getBoundingClientRect();

    // Calculate offset for the main dragged icon
    const offsetX = e.clientX - iconRect.left;
    const offsetY = e.clientY - iconRect.top;

    setDraggedIcon({
      id: iconId,
      index: index,
      startX: icon.x || 0,
      startY: icon.y || 0,
      offsetX,
      offsetY,
    });

    setShowGrid(true); // Show grid during drag
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", iconId);

    // Add visual feedback for all selected icons
    setTimeout(() => {
      selectedIcons.forEach((id) => {
        const iconElement = document.querySelector(`[data-icon-id="${id}"]`);
        if (iconElement) {
          iconElement.style.opacity = "0.5";
        }
      });
    }, 0);
  };

  const handleIconDragEnd = () => {
    // Restore opacity for all selected icons
    selectedIcons.forEach((id) => {
      const iconElement = document.querySelector(`[data-icon-id="${id}"]`);
      if (iconElement) {
        iconElement.style.opacity = "1";
      }
    });

    setDraggedIcon(null);
    setDragOverIndex(null);
    setShowGrid(false); // Hide grid when drag ends
  };
  const handleDesktopDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Grid snapping configuration
  const GRID_SIZE = 100; // Grid cell size in pixels
  const ICON_PADDING = 20; // Padding from desktop edges

  // Function to snap coordinates to grid
  const snapToGrid = (x, y, containerWidth, containerHeight) => {
    // Calculate grid positions
    const gridX =
      Math.round((x - ICON_PADDING) / GRID_SIZE) * GRID_SIZE + ICON_PADDING;
    const gridY =
      Math.round((y - ICON_PADDING) / GRID_SIZE) * GRID_SIZE + ICON_PADDING;

    // Ensure we stay within bounds
    const iconSize = 80;
    const maxX = containerWidth - iconSize - ICON_PADDING;
    const maxY = containerHeight - 48 - iconSize - ICON_PADDING; // 48px for taskbar

    const snappedX = Math.max(ICON_PADDING, Math.min(gridX, maxX));
    const snappedY = Math.max(ICON_PADDING, Math.min(gridY, maxY));

    return { x: snappedX, y: snappedY };
  };

  const handleDesktopDrop = (e) => {
    e.preventDefault();

    if (!draggedIcon) return;

    // Get the desktop container's position
    const desktopRect = e.currentTarget.getBoundingClientRect();

    // Calculate new position for the main dragged icon
    const rawX = e.clientX - desktopRect.left - draggedIcon.offsetX;
    const rawY = e.clientY - desktopRect.top - draggedIcon.offsetY;

    // Snap to grid
    const { x: snappedX, y: snappedY } = snapToGrid(
      rawX,
      rawY,
      desktopRect.width,
      desktopRect.height
    );

    // Calculate the offset from original position
    const deltaX = snappedX - draggedIcon.startX;
    const deltaY = snappedY - draggedIcon.startY;

    // Update positions for all selected icons
    const newIcons = [...desktopIcons];
    selectedIcons.forEach((iconId) => {
      const iconIndex = newIcons.findIndex((icon) => icon.id === iconId);
      if (iconIndex !== -1) {
        const currentIcon = newIcons[iconIndex];
        const newX = (currentIcon.x || 0) + deltaX;
        const newY = (currentIcon.y || 0) + deltaY;

        // Snap each icon to grid and ensure it stays within bounds
        const { x: finalX, y: finalY } = snapToGrid(
          newX,
          newY,
          desktopRect.width,
          desktopRect.height
        );

        newIcons[iconIndex] = {
          ...currentIcon,
          x: finalX,
          y: finalY,
        };
      }
    });

    setDesktopIcons(newIcons);
    setDraggedIcon(null);
  };

  // Keep these handlers for potential future use with icon-to-icon interactions
  const handleIconDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleIconDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleIconDrop = (e) => {
    e.preventDefault();
    // For now, we'll let the desktop handle all drops
    // This could be extended later for icon-specific interactions
  };
  const handleIconClick = (e, iconId) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Toggle selection with Ctrl+click
      const newSelection = new Set(selectedIcons);
      if (newSelection.has(iconId)) {
        newSelection.delete(iconId);
      } else {
        newSelection.add(iconId);
      }
      setSelectedIcons(newSelection);
    } else {
      // Single selection
      setSelectedIcons(new Set([iconId]));
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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDesktopDragOver}
      onDrop={handleDesktopDrop}
      data-desktop-container="true"
    >
      {/* Grid overlay for drag operations */}
      <div
        className={`${styles.gridOverlay} ${showGrid ? styles.visible : ""}`}
      />

      {/* Selection box for multi-select */}
      {isBoxSelecting && (
        <div
          className={styles.selectionBox}
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      <div className={styles.desktopIconsContainer}>
        {" "}
        {/* New container for icons */}
        {desktopIcons.map((icon, index) => (
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
            // Position props
            x={icon.x || 20}
            y={icon.y || 20 + index * 100}
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
            onClick={(e) => handleIconClick(e, icon.id)}
            onRightClick={(e) => handleIconRightClick(e, icon.id)}
            isRenaming={renamingIcon === icon.id}
            onFinishRename={(newName) => finishRenaming(icon.id, newName)}
            onCancelRename={cancelRenaming}
            // Selection props
            isSelected={selectedIcons.has(icon.id)}
            iconId={icon.id}
            // Drag and drop props
            draggable={true}
            onDragStart={(e) => handleIconDragStart(e, icon.id, index)}
            onDragEnd={handleIconDragEnd}
            onDragOver={handleIconDragOver}
            onDragLeave={handleIconDragLeave}
            onDrop={handleIconDrop}
            isDragOver={dragOverIndex === index}
            isDragging={draggedIcon?.id === icon.id}
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
            ) : window.appType === "calculator" ? (
              <Calculator
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onMaximize={() => maximizeWindow(window.id)}
                isMaximized={window.status === "maximized"}
              />
            ) : window.appType === "file-explorer" ? (
              <FileExplorer
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
