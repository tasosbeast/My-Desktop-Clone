import React from "react";
import styles from "./Icon.module.css";

function Icon({ name, image, onDoubleClick }) {
  // onDoubleClick prop
  return (
    <div className={styles.icon} onDoubleClick={onDoubleClick}>
      <img src={image} alt={name} className={styles.iconImage} />
      <span className={styles.iconName}>{name}</span>
    </div>
  );
}

export default Icon;
