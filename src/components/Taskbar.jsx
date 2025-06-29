import React from "react";
import styles from "./Taskbar.module.css";
import StartButton from "./StartButton";
import Clock from "./clock";

export default function Taskbar({ onStartButtonClick }) {
  return (
    <div className={styles.taskbar}>
      <div className={styles.taskbarLeft}>
        <StartButton onClick={onStartButtonClick} />
      </div>
      <div className={styles.taskbarCenter}>
        {/* Pinned apps will go here */}
      </div>
      <div className={styles.taskbarRight}>
        {/* System tray icons & clock will go here */}
        <Clock />
      </div>
    </div>
  );
}
