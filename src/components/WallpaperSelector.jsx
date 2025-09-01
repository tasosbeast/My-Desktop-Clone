import React, { useState } from "react";
import styles from "./WallpaperSelector.module.css";

const predefinedWallpapers = [
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
    id: "solid-dark",
    name: "Dark Theme",
    color: "#1e1e1e",
  },
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "gradient-sunset",
    name: "Sunset Gradient",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  {
    id: "gradient-ocean",
    name: "Ocean Gradient",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
];

function WallpaperSelector({
  isOpen,
  onClose,
  onSelectWallpaper,
  currentWallpaper,
}) {
  const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper);
  const [customImageUrl, setCustomImageUrl] = useState("");

  if (!isOpen) return null;

  const handleWallpaperSelect = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  const handleApply = () => {
    onSelectWallpaper(selectedWallpaper);
    onClose();
  };

  const handleCustomImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customWallpaper = {
          id: "custom-" + Date.now(),
          name: "Custom Image",
          image: event.target.result,
          isCustom: true,
        };
        setSelectedWallpaper(customWallpaper);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlChange = (e) => {
    setCustomImageUrl(e.target.value);
  };

  const handleCustomUrlApply = () => {
    if (customImageUrl.trim()) {
      const customWallpaper = {
        id: "custom-url-" + Date.now(),
        name: "Custom URL",
        image: customImageUrl.trim(),
        isCustom: true,
      };
      setSelectedWallpaper(customWallpaper);
      setCustomImageUrl("");
    }
  };

  const getWallpaperStyle = (wallpaper) => {
    if (wallpaper.image) {
      return {
        backgroundImage: `url(${wallpaper.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else if (wallpaper.gradient) {
      return {
        background: wallpaper.gradient,
      };
    } else if (wallpaper.color) {
      return {
        backgroundColor: wallpaper.color,
      };
    }
    return {};
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Choose Wallpaper</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.wallpaperGrid}>
            {predefinedWallpapers.map((wallpaper) => (
              <div
                key={wallpaper.id}
                className={`${styles.wallpaperOption} ${
                  selectedWallpaper?.id === wallpaper.id ? styles.selected : ""
                }`}
                style={getWallpaperStyle(wallpaper)}
                onClick={() => handleWallpaperSelect(wallpaper)}
              >
                <div className={styles.wallpaperName}>{wallpaper.name}</div>
              </div>
            ))}
          </div>

          <div className={styles.customSection}>
            <h3>Custom Wallpaper</h3>

            <div className={styles.customOption}>
              <label htmlFor="fileInput">Upload Image:</label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleCustomImageChange}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.customOption}>
              <label htmlFor="urlInput">Image URL:</label>
              <div className={styles.urlInputGroup}>
                <input
                  id="urlInput"
                  type="url"
                  value={customImageUrl}
                  onChange={handleCustomUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className={styles.urlInput}
                />
                <button
                  onClick={handleCustomUrlApply}
                  className={styles.urlButton}
                  disabled={!customImageUrl.trim()}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {selectedWallpaper && (
            <div className={styles.preview}>
              <h3>Preview:</h3>
              <div
                className={styles.previewBox}
                style={getWallpaperStyle(selectedWallpaper)}
              >
                <div className={styles.previewLabel}>
                  {selectedWallpaper.name}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.applyButton}
            onClick={handleApply}
            disabled={!selectedWallpaper}
          >
            Apply Wallpaper
          </button>
        </div>
      </div>
    </div>
  );
}

export default WallpaperSelector;
