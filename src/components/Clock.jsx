// src/components/Clock.jsx
import React, { useState, useEffect } from "react";
import styles from "./Clock.module.css"; // Use module CSS

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(timerId);
  }, []); // Empty dependency array means this runs once on mount

  // Format date and time
  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString([], {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  // --- Formatting for the tooltip (more detailed) ---
  // Date: "Σάββατο, 28 Ιουνίου 2025"
  const tooltipDate = time.toLocaleDateString("el-GR", {
    weekday: "long", // e.g., 'Σάββατο'
    year: "numeric",
    month: "long", // e.g., 'Ιουνίου'
    day: "numeric",
  });

  // Time: "05:30:45 AM"
  const tooltipTime = time.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // AM/PM
  });

  return (
    <div className={styles.clockContainer}>
      <div className={styles.time}>{formattedTime}</div>
      <div className={styles.date}>{formattedDate}</div>

      <div className={styles.tooltip}>
        <div>{tooltipDate}</div>
        <div>{tooltipTime}</div>
      </div>
    </div>
  );
}

export default Clock;
