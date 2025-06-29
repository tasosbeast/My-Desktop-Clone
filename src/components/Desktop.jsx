import React, { useState } from "react";
import styles from "./Desktop.module.css";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Icon from "./Icon";
import Window from "./Window";

let nextZIndex = 1001;

function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);

  const desktopIcons = [
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
  ];
  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev); // Toggle the state
  };

  const bringWindowToFront = (idToFocus) => {
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

      // Sort the array by zIndex to ensure correct rendering order in React
      // (Though CSS z-index handles actual stacking, sorting can help conceptual order)
      // This sort isn't strictly necessary for visual stacking due to CSS z-index,
      // but can be helpful for internal logic or if you want elements with higher zIndex
      // to appear later in the DOM (though position absolute removes from flow).
      // For simplicity, you can skip sorting here if ZIndex in CSS is sufficient.
      // However, let's keep it to ensure the "focused" window is always at the end
      // of the array, which can be useful for taskbar ordering later.
      updatedWindows.sort((a, b) => a.zIndex - b.zIndex);

      return updatedWindows;
    });
  };

  const openWindow = (id, title, content) => {
    // Check if window is already open (optional, but good practice)
    if (!openWindows.some((window) => window.id === id)) {
      nextZIndex++;
      setOpenWindows((prevWindows) => [
        ...prevWindows,
        {
          id: id,
          title: title,
          content: content,
          x: 100 + prevWindows.length * 20, // Stagger position
          y: 100 + prevWindows.length * 20,
          width: 600,
          height: 400,
          zIndex: prevWindows.length + 1, // Initial z-index
        },
      ]);
    } else {
      bringWindowToFront(id);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows((prevWindows) =>
      prevWindows.filter((window) => window.id !== id)
    );
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
  return (
    <div className={styles.desktop}>
      <div className={styles.desktopIconsContainer}>
        {" "}
        {/* New container for icons */}
        {desktopIcons.map((icon) => (
          <Icon
            key={icon.id}
            name={icon.name}
            image={icon.image}
            onDoubleClick={() => openWindow(icon.id, icon.name, icon.content)}
          />
        ))}
      </div>

      {/* Render open windows */}
      {openWindows.map((window) => (
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
        >
          {window.content} {/* Pass content as children */}
        </Window>
      ))}

      {isStartMenuOpen && <StartMenu />}
      <Taskbar onStartButtonClick={toggleStartMenu} />
    </div>
  );
}

export default Desktop;
