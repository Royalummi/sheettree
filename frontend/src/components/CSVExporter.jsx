import React, { useState } from "react";
import {
  Download,
  Calendar,
  Filter,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { ProgressBar, AnimatedToast } from "./UI/Animations";

const CSVExporter = ({ formId, formFields, onClose }) => {
  const [selectedFields, setSelectedFields] = useState(
    formFields.map((f) => f.id)
  );
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [filters, setFilters] = useState({
    status: "all", // all, pending, completed
    includeMetadata: true,
  });
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const handleFieldToggle = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFields.length === formFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(formFields.map((f) => f.id));
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      setToast({
        type: "warning",
        message: "Please select at least one field to export",
      });
      return;
    }

    setExporting(true);
    setProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare export parameters
      const exportParams = {
        formId,
        fields: selectedFields,
        dateRange: {
          start: dateRange.start || null,
          end: dateRange.end || null,
        },
        status: filters.status,
        includeMetadata: filters.includeMetadata,
      };

      // TODO: Replace with actual API call
      const response = await fetch(`/api/forms/${formId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(exportParams),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Download the CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form-${formId}-submissions-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setToast({
        type: "success",
        message: "CSV file downloaded successfully",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Export error:", error);
      setToast({
        type: "error",
        message: `Export failed: ${error.message}`,
      });
      setProgress(0);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export to CSV
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Fields to Export
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                {selectedFields.length === formFields.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleFieldToggle(field.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {field.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {field.type}
                    </div>
                  </div>
                  {selectedFields.includes(field.id) && (
                    <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Filter className="w-4 h-4 inline mr-2" />
              Filters
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Submission Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Only</option>
                  <option value="completed">Completed Only</option>
                </select>
              </div>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeMetadata}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      includeMetadata: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Include Metadata
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    IP address, timestamp, user agent
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {exporting && (
            <div>
              <ProgressBar progress={progress} showPercentage />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedFields.length} field(s) selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={exporting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || selectedFields.length === 0}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <AnimatedToast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CSVExporter;
