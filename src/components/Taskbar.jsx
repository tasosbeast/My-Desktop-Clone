import React from "react";
import styles from "./Taskbar.module.css";
import StartButton from "./StartButton";
import SystemTray from "./SystemTray";
import TaskbarIcon from "./TaskbarIcon";
import TaskbarSearch from "./TaskbarSearch";
import WeatherWidget from "./WeatherWidget";

export default function Taskbar({
  onStartButtonClick,
  openWindows,
  onFocus,
  activeWindowId,
  onMinimize,
  onShowDesktop,
  onSearch,
  isSearchActive,
  onToggleSearch,
}) {
  return (
    <div className={styles.taskbar}>
      <div className={styles.taskbarLeft}>
        <WeatherWidget />
        <StartButton onClick={onStartButtonClick} />
        <TaskbarSearch
          onSearch={onSearch}
          isSearchActive={isSearchActive}
          onToggleSearch={onToggleSearch}
        />
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
        <SystemTray onShowDesktop={onShowDesktop} />
      </div>
    </div>
  );
}
