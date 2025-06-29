import React, { useState } from "react";
import styles from "./Desktop.module.css";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";

function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev); // Toggle the state
  };
  return (
    <div className={styles.desktop}>
      {isStartMenuOpen && <StartMenu />}
      <Taskbar onStartButtonClick={toggleStartMenu} />
    </div>
  );
}

export default Desktop;
