import React, { useState } from "react";
import styles from "./Desktop.module.css";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Icon from "./Icon";
import Window from "./Window";

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

  const openWindow = (id, title, content) => {
    // Check if window is already open (optional, but good practice)
    if (!openWindows.some((window) => window.id === id)) {
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
    }
  };
  return (
    <div className={styles.desktop}>
      {isStartMenuOpen && <StartMenu />}
      <Taskbar onStartButtonClick={toggleStartMenu} />
    </div>
  );
}

export default Desktop;
