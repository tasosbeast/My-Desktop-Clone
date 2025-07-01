import React from "react";
import styles from "./Icon.module.css";

function Icon({ name, image, onClick, onDoubleClick }) {
  return (
    <div
      className={styles.icon}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <img src={image} alt={name} className={styles.iconImage} />
      <span className={styles.iconName}>{name}</span>
    </div>
  );
}

export default Icon;
