import React from "react";
import styles from "./Taskbar.module.css";
import StartButton from "./StartButton";
import Clock from "./clock";
import TaskbarIcon from "./TaskbarIcon";

export default function Taskbar({
  onStartButtonClick,
  openWindows,
  onFocus,
  activeWindowId,
}) {
  return (
    <div className={styles.taskbar}>
      <div className={styles.taskbarLeft}>
        <StartButton onClick={onStartButtonClick} />
      </div>
      <div className={styles.taskbarCenter}>
        {openWindows.map((win) => (
          <TaskbarIcon
            key={win.id}
            window={win}
            onFocus={onFocus}
            isActive={win.id === activeWindowId}
          />
        ))}
      </div>
      <div className={styles.taskbarRight}>
        {/* System tray icons & clock will go here */}
        <Clock />
      </div>
    </div>
  );
}
