import React, { useState } from "react";
import {
  Trash2,
  Archive,
  Download,
  Copy,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { AnimatedToast } from "./UI/Animations";

const BulkActions = ({
  items,
  selectedIds,
  onSelectionChange,
  onAction,
  itemType = "form",
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < items.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map((item) => item.id));
    }
  };

  const handleToggleItem = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      setToast({
        type: "warning",
        message: `Please select ${itemType}s to perform this action`,
      });
      return;
    }

    // Actions that need confirmation
    const dangerousActions = ["delete", "archive"];
    if (dangerousActions.includes(action)) {
      setConfirmAction(action);
      setShowConfirm(true);
      return;
    }

    // Execute non-dangerous actions immediately
    await executeBulkAction(action);
  };

  const executeBulkAction = async (action) => {
    try {
      await onAction(action, selectedIds);

      const messages = {
        delete: `Successfully deleted ${selectedIds.length} ${itemType}(s)`,
        archive: `Successfully archived ${selectedIds.length} ${itemType}(s)`,
        duplicate: `Successfully duplicated ${selectedIds.length} ${itemType}(s)`,
        activate: `Successfully activated ${selectedIds.length} ${itemType}(s)`,
        deactivate: `Successfully deactivated ${selectedIds.length} ${itemType}(s)`,
        export: `Successfully exported ${selectedIds.length} ${itemType}(s)`,
      };

      setToast({
        type: "success",
        message: messages[action] || "Action completed successfully",
      });

      // Clear selection after successful action
      onSelectionChange([]);
      setShowConfirm(false);
      setConfirmAction(null);
    } catch (error) {
      setToast({
        type: "error",
        message: `Failed to ${action} ${itemType}s: ${error.message}`,
      });
    }
  };

  const renderActionButton = (action, icon, label, variant = "default") => {
    const variantClasses = {
      default: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
      danger: "bg-white hover:bg-red-50 text-red-600 border-red-300",
      primary: "bg-purple-600 hover:bg-purple-700 text-white border-purple-600",
    };

    return (
      <button
        onClick={() => handleBulkAction(action)}
        disabled={selectedIds.length === 0}
        className={`
          inline-flex items-center px-3 py-2 border rounded-lg font-medium
          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300
          dark:hover:bg-gray-700
        `}
        title={label}
      >
        {icon}
        <span className="ml-2 hidden sm:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Selection Header */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSelectionChange([])}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {selectedIds.length} {itemType}(s) selected
              </span>
            </div>
            <button
              onClick={handleSelectAll}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              {isAllSelected ? "Deselect All" : `Select All (${items.length})`}
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Select All Checkbox */}
          <button
            onClick={handleSelectAll}
            className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            {isAllSelected ? (
              <CheckSquare className="w-5 h-5" />
            ) : isSomeSelected ? (
              <div className="w-5 h-5 border-2 border-purple-600 dark:border-purple-400 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-sm"></div>
              </div>
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span className="ml-2 text-sm font-medium">Select</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            {renderActionButton(
              "activate",
              <ToggleRight className="w-4 h-4" />,
              "Activate",
              "default"
            )}
            {renderActionButton(
              "deactivate",
              <ToggleLeft className="w-4 h-4" />,
              "Deactivate",
              "default"
            )}
            {renderActionButton(
              "duplicate",
              <Copy className="w-4 h-4" />,
              "Duplicate",
              "default"
            )}
            {renderActionButton(
              "export",
              <Download className="w-4 h-4" />,
              "Export",
              "primary"
            )}
            {renderActionButton(
              "archive",
              <Archive className="w-4 h-4" />,
              "Archive",
              "default"
            )}
            {renderActionButton(
              "delete",
              <Trash2 className="w-4 h-4" />,
              "Delete",
              "danger"
            )}
          </div>
        </div>
      </div>

      {/* Individual Item Checkboxes (render in parent component) */}
      {items.map((item) => (
        <input
          key={item.id}
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleToggleItem(item.id)}
          className="hidden" // Hidden, parent will render visible checkboxes
          id={`bulk-checkbox-${item.id}`}
        />
      ))}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full mr-4">
                {confirmAction === "delete" ? (
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Archive className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm {confirmAction === "delete" ? "Deletion" : "Archive"}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to {confirmAction} {selectedIds.length}{" "}
              {itemType}(s)?
              {confirmAction === "delete" && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                  This action cannot be undone.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executeBulkAction(confirmAction)}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  confirmAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {confirmAction === "delete" ? "Delete" : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <AnimatedToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BulkActions;
