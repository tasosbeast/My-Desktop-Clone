import React, { useState } from "react";
import styles from "./Settings.module.css";

function Settings({
  isOpen,
  onClose,
  currentWallpaper,
  onWallpaperChange,
  desktopIcons,
  onIconSettingsChange,
}) {
  const [activeTab, setActiveTab] = useState("personalization");

  if (!isOpen) return null;

  const settingsTabs = [
    { id: "personalization", name: "Personalization", icon: "🎨" },
    { id: "system", name: "System", icon: "⚙️" },
    { id: "desktop", name: "Desktop", icon: "🖥️" },
    { id: "accessibility", name: "Accessibility", icon: "♿" },
  ];

  const wallpaperOptions = [
    {
      id: "default",
      name: "Windows 11 Default",
      image: "/Windows-11-bg.webp",
    },
    {
      id: "solid-blue",
      name: "Solid Blue",
      color: "#0078d4",
    },
    {
      id: "gradient-blue",
      name: "Blue Gradient",
      gradient: "linear-gradient(135deg, #0078d4, #106ebe)",
    },
    {
      id: "solid-dark",
      name: "Dark Theme",
      color: "#1e1e1e",
    },
    {
      id: "gradient-purple",
      name: "Purple Gradient",
      gradient: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
    },
    {
      id: "gradient-green",
      name: "Green Gradient",
      gradient: "linear-gradient(135deg, #059669, #10b981)",
    },
  ];

  const handleWallpaperSelect = (wallpaper) => {
    onWallpaperChange(wallpaper);
  };

  const renderPersonalizationTab = () => (
    <div className={styles.tabContent}>
      <h3>Background</h3>
      <div className={styles.wallpaperGrid}>
        {wallpaperOptions.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className={`${styles.wallpaperOption} ${
              currentWallpaper.id === wallpaper.id ? styles.active : ""
            }`}
            onClick={() => handleWallpaperSelect(wallpaper)}
          >
            <div
              className={styles.wallpaperPreview}
              style={{
                backgroundImage: wallpaper.image
                  ? `url(${wallpaper.image})`
                  : "none",
                backgroundColor: wallpaper.color || "transparent",
                background:
                  wallpaper.gradient ||
                  wallpaper.color ||
                  `url(${wallpaper.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <span className={styles.wallpaperName}>{wallpaper.name}</span>
          </div>
        ))}
      </div>

      <h3>Theme</h3>
      <div className={styles.themeOptions}>
        <div className={styles.themeOption}>
          <span>🌞 Light</span>
        </div>
        <div className={styles.themeOption}>
          <span>🌙 Dark</span>
        </div>
        <div className={styles.themeOption}>
          <span>🔄 Auto</span>
        </div>
      </div>

      <h3>Colors</h3>
      <div className={styles.colorOptions}>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#0078d4" }}
        ></div>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#6b46c1" }}
        ></div>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#059669" }}
        ></div>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#dc2626" }}
        ></div>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#ea580c" }}
        ></div>
        <div
          className={styles.colorOption}
          style={{ backgroundColor: "#ca8a04" }}
        ></div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className={styles.tabContent}>
      <h3>Display</h3>
      <div className={styles.setting}>
        <label>
          <span>Scale and layout</span>
          <select className={styles.select}>
            <option>100% (Recommended)</option>
            <option>125%</option>
            <option>150%</option>
            <option>175%</option>
          </select>
        </label>
      </div>

      <h3>Sound</h3>
      <div className={styles.setting}>
        <label>
          <span>System sounds</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>

      <h3>Notifications</h3>
      <div className={styles.setting}>
        <label>
          <span>Show notifications</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Show notifications on lock screen</span>
          <input type="checkbox" />
        </label>
      </div>
    </div>
  );

  const renderDesktopTab = () => (
    <div className={styles.tabContent}>
      <h3>Desktop Icons</h3>
      <div className={styles.setting}>
        <label>
          <span>Show desktop icons</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Auto-arrange icons</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Snap to grid</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>

      <h3>Taskbar</h3>
      <div className={styles.setting}>
        <label>
          <span>Auto-hide taskbar</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Show taskbar on all displays</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>

      <h3>Desktop Effects</h3>
      <div className={styles.setting}>
        <label>
          <span>Show transparency effects</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Show animations</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className={styles.tabContent}>
      <h3>Vision</h3>
      <div className={styles.setting}>
        <label>
          <span>High contrast</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Text size</span>
          <select className={styles.select}>
            <option>100% (Default)</option>
            <option>125%</option>
            <option>150%</option>
            <option>175%</option>
            <option>200%</option>
          </select>
        </label>
      </div>

      <h3>Interaction</h3>
      <div className={styles.setting}>
        <label>
          <span>Sticky keys</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Filter keys</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Mouse keys</span>
          <input type="checkbox" />
        </label>
      </div>

      <h3>Audio</h3>
      <div className={styles.setting}>
        <label>
          <span>Sound notifications</span>
          <input type="checkbox" />
        </label>
      </div>
      <div className={styles.setting}>
        <label>
          <span>Visual notifications</span>
          <input type="checkbox" />
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personalization":
        return renderPersonalizationTab();
      case "system":
        return renderSystemTab();
      case "desktop":
        return renderDesktopTab();
      case "accessibility":
        return renderAccessibilityTab();
      default:
        return renderPersonalizationTab();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.settingsWindow}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.sidebar}>
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabName}>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.mainContent}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
