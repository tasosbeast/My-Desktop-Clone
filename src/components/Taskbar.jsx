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
  onMinimize,
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
            isActive={win.id === activeWindowId}
            onFocus={() => {
              // If the window is already active and not minimized, minimize it.
              if (win.id === activeWindowId && win.status !== "minimized") {
                onMinimize(win.id);
              } else {
                // Otherwise, do the standard restore/focus behavior.
                // This part handles both restoring a minimized window and focusing an inactive one.
                if (win.status === "minimized") {
                  onMinimize(win.id); // This toggles it back to 'open'
                }
                onFocus(win.id); // This sets it as active and brings it to the front
              }
            }}
            onMiddleClick={() => onMinimize(win.id)}
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
