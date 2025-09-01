import React, { useState } from "react";
import styles from "./RecycleBin.module.css";

export default function RecycleBin({
  isOpen,
  onClose,
  recycleBinItems,
  onRestoreItem,
  onPermanentDelete,
  onEmptyRecycleBin,
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  if (!isOpen) return null;

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === recycleBinItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(recycleBinItems.map((item) => item.id));
    }
  };

  const handleRestoreSelected = () => {
    selectedItems.forEach((itemId) => {
      onRestoreItem(itemId);
    });
    setSelectedItems([]);
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`
      )
    ) {
      selectedItems.forEach((itemId) => {
        onPermanentDelete(itemId);
      });
      setSelectedItems([]);
    }
  };

  const handleEmptyRecycleBin = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all items in the Recycle Bin? This action cannot be undone."
      )
    ) {
      onEmptyRecycleBin();
      setSelectedItems([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.recycleBin}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <span className={styles.icon}>🗑️</span>
            Recycle Bin ({recycleBinItems.length} items)
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <button
            className={styles.toolbarButton}
            onClick={handleRestoreSelected}
            disabled={selectedItems.length === 0}
          >
            📤 Restore
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            🗑️ Delete Permanently
          </button>
          <button className={styles.toolbarButton} onClick={handleSelectAll}>
            {selectedItems.length === recycleBinItems.length
              ? "📋 Deselect All"
              : "📋 Select All"}
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleEmptyRecycleBin}
            disabled={recycleBinItems.length === 0}
          >
            🧹 Empty Recycle Bin
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {recycleBinItems.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🗑️</span>
              <p>Recycle Bin is empty</p>
              <p className={styles.emptySubtext}>
                Items you delete will appear here
              </p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {/* Headers */}
              <div className={styles.listHeader}>
                <div className={styles.headerCell}>Name</div>
                <div className={styles.headerCell}>Original Location</div>
                <div className={styles.headerCell}>Date Deleted</div>
                <div className={styles.headerCell}>Type</div>
              </div>

              {/* Items */}
              {recycleBinItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.listItem} ${
                    selectedItems.includes(item.id) ? styles.selected : ""
                  }`}
                  onClick={() => handleItemSelect(item.id)}
                >
                  <div className={styles.itemCell}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelect(item.id)}
                      className={styles.checkbox}
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemIcon}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                  <div className={styles.itemCell}>{item.originalLocation}</div>
                  <div className={styles.itemCell}>
                    {formatDate(item.deletedAt)}
                  </div>
                  <div className={styles.itemCell}>{item.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          {selectedItems.length > 0 ? (
            <span>{selectedItems.length} item(s) selected</span>
          ) : (
            <span>{recycleBinItems.length} item(s)</span>
          )}
        </div>
      </div>
    </div>
  );
}
