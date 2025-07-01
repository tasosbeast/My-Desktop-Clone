import React from "react";
import styles from "./TaskbarIcon.module.css";

function TaskbarIcon({ window, onFocus, isActive }) {
  const iconClasses = `${styles.taskbarIcon} ${isActive ? styles.active : ""}`;
  return (
    <div className={iconClasses} onClick={onFocus}>
      <img src={window.image} alt={window.title} className={styles.iconImage} />
    </div>
  );
}

export default TaskbarIcon;
