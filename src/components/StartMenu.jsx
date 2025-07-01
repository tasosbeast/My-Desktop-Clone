// src/components/StartMenu.jsx
import React from "react";
import styles from "./StartMenu.module.css"; // Use module CSS
import Icon from "./Icon";

function StartMenu({ onOpenApp, onCloseMenu }) {
  const startMenuItems = [
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
    onOpenApp(item.id, item.name, item.content, item.image);
    onCloseMenu();
  };
  return (
    <div className={styles.startMenu}>
      {/* 4. Add a grid container */}
      <div className={styles.menuGrid}>
        {startMenuItems.map((item) => (
          <Icon
            key={item.id}
            name={item.name}
            image={item.image}
            onClick={() => handleAppClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default StartMenu;
