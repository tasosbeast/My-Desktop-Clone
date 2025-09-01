import React, { useState } from "react";
import styles from "./SystemTray.module.css";
import Clock from "./clock";

export default function SystemTray({ onShowDesktop }) {
  const [showSystemTrayMenu, setShowSystemTrayMenu] = useState(false);
  const [volume, setVolume] = useState(75);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [airplaneModeEnabled, setAirplaneModeEnabled] = useState(false);

  // System tray icons data
  const systemTrayIcons = [
    {
      id: "wifi",
      icon: wifiEnabled ? "📶" : "📵",
      tooltip: `Network: ${wifiEnabled ? "Connected" : "Disconnected"}`,
      onClick: () => setWifiEnabled(!wifiEnabled),
    },
    {
      id: "volume",
      icon: volume > 50 ? "🔊" : volume > 0 ? "🔉" : "🔇",
      tooltip: `Volume: ${volume}%`,
      onClick: () => setVolume(volume > 0 ? 0 : 75),
    },
    {
      id: "battery",
      icon: "🔋",
      tooltip: "Battery: 85% remaining",
      onClick: () => console.log("Battery clicked"),
    },
    {
      id: "notifications",
      icon: "🔔",
      tooltip: "Notifications",
      onClick: () => setShowSystemTrayMenu(!showSystemTrayMenu),
    },
  ];

  return (
    <div className={styles.systemTray}>
      {/* System Tray Icons */}
      <div className={styles.systemTrayIcons}>
        {systemTrayIcons.map((item) => (
          <div
            key={item.id}
            className={styles.systemTrayIcon}
            onClick={item.onClick}
            title={item.tooltip}
          >
            <span className={styles.iconSymbol}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className={styles.separator}></div>

      {/* Clock */}
      <div className={styles.clockSection}>
        <Clock />
      </div>

      {/* Show Desktop Button */}
      <div
        className={styles.showDesktopButton}
        onClick={() => onShowDesktop && onShowDesktop()}
        title="Show desktop"
      ></div>

      {/* System Tray Menu (notifications panel) */}
      {showSystemTrayMenu && (
        <div className={styles.systemTrayMenu}>
          <div className={styles.menuHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <div
              className={styles.quickAction}
              onClick={() => setWifiEnabled(!wifiEnabled)}
            >
              <span>WiFi</span>
              <div
                className={styles.toggle}
                style={{
                  backgroundColor: wifiEnabled
                    ? "rgba(0, 120, 215, 0.8)"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              >
                {wifiEnabled ? "On" : "Off"}
              </div>
            </div>
            <div
              className={styles.quickAction}
              onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            >
              <span>Bluetooth</span>
              <div
                className={styles.toggle}
                style={{
                  backgroundColor: bluetoothEnabled
                    ? "rgba(0, 120, 215, 0.8)"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              >
                {bluetoothEnabled ? "On" : "Off"}
              </div>
            </div>
            <div
              className={styles.quickAction}
              onClick={() => setAirplaneModeEnabled(!airplaneModeEnabled)}
            >
              <span>Airplane mode</span>
              <div
                className={styles.toggle}
                style={{
                  backgroundColor: airplaneModeEnabled
                    ? "rgba(0, 120, 215, 0.8)"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              >
                {airplaneModeEnabled ? "On" : "Off"}
              </div>
            </div>
            <div className={styles.quickAction}>
              <span>Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "rgba(0, 120, 215, 0.8)",
                }}
              />
              <span style={{ fontSize: "12px", marginLeft: "8px" }}>
                {volume}%
              </span>
            </div>
          </div>
          <div className={styles.menuFooter}>
            <button onClick={() => setShowSystemTrayMenu(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
