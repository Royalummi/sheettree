import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileSpreadsheet,
  Type,
  Mail,
  Phone,
  Calendar,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Loader,
} from "lucide-react";
import { updateForm, getForm } from "../../store/slices/formsSlice";
import { getUserSheets } from "../../store/slices/sheetsSlice";
import Toast from "../../components/UI/Toast";

const EditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, currentForm } = useSelector((state) => state.forms);
  const { sheets } = useSelector((state) => state.sheets);

  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    connected_sheet_id: "",
    is_active: true,
    is_public: false,
    fields: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const sheetsArray = Array.isArray(sheets) ? sheets : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([dispatch(getForm(id)), dispatch(getUserSheets())]);
      } catch (error) {
        setToast({ message: "Failed to load form data", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, id]);

  useEffect(() => {
    if (currentForm) {
      setFormData({
        title: currentForm.title || "",
        description: currentForm.description || "",
        connected_sheet_id: currentForm.connected_sheet_id || "",
        is_active: currentForm.is_active || false,
        is_public: currentForm.is_public || false,
        fields: currentForm.fields || [],
      });
    }
  }, [currentForm]);

  const fieldTypes = [
    { type: "text", label: "Text", icon: Type },
    { type: "email", label: "Email", icon: Mail },
    { type: "tel", label: "Phone", icon: Phone },
    { type: "date", label: "Date", icon: Calendar },
    { type: "textarea", label: "Long Text", icon: Type },
    { type: "select", label: "Dropdown", icon: Type },
    { type: "radio", label: "Multiple Choice", icon: Type },
    { type: "checkbox", label: "Checkboxes", icon: Type },
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      name: `field_${formData.fields.length + 1}`,
      label: `Field ${formData.fields.length + 1}`,
      placeholder: "",
      required: false,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1"]
          : [],
    };

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });
  };

  const updateField = (index, updates) => {
    const updatedFields = formData.fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFormData({ ...formData, fields: updatedFields });
  };

  const removeField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: updatedFields });
  };

  const addOption = (fieldIndex) => {
    const field = formData.fields[fieldIndex];
    const newOption = `Option ${field.options.length + 1}`;
    updateField(fieldIndex, {
      options: [...field.options, newOption],
    });
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const field = formData.fields[fieldIndex];
    const updatedOptions = field.options.map((option, i) =>
      i === optionIndex ? value : option
    );
    updateField(fieldIndex, { options: updatedOptions });
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const field = formData.fields[fieldIndex];
    const updatedOptions = field.options.filter((_, i) => i !== optionIndex);
    updateField(fieldIndex, { options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fields.length === 0) {
      setToast({
        message: "Please add at least one field to your form",
        type: "error",
      });
      return;
    }

    try {
      await dispatch(updateForm({ id, ...formData })).unwrap();
      setToast({ message: "Form updated successfully!", type: "success" });
      setTimeout(() => navigate("/forms"), 2000);
    } catch (error) {
      console.error("Failed to update form:", error);
      setToast({ message: error || "Failed to update form", type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/forms")}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
          <p className="text-gray-600 mt-1">
            Update your form configuration and fields
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Form Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Contact Form, Survey, Registration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Brief description of what this form is for..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connected Google Sheet
              </label>
              {sheetsArray.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-yellow-700 text-sm">
                      No Google Sheets connected
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/sheets")}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Connect Sheet
                  </button>
                </div>
              ) : (
                <select
                  value={formData.connected_sheet_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      connected_sheet_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a sheet (optional)</option>
                  {sheetsArray.map((sheet) => (
                    <option key={sheet.id} value={sheet.id}>
                      {sheet.spreadsheet_name} - {sheet.sheet_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
                  className="flex items-center"
                >
                  {formData.is_active ? (
                    <ToggleRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <label className="text-sm font-medium text-gray-700">
                  Active (accepts submissions)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_public: !formData.is_public })
                  }
                  className="flex items-center"
                >
                  {formData.is_public ? (
                    <ToggleRight className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <label className="text-sm font-medium text-gray-700">
                  Public (accessible to everyone)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>
            <div className="text-sm text-gray-500">
              {formData.fields.length} field
              {formData.fields.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Field Types */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Add Field Type:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    type="button"
                    onClick={() => addField(fieldType.type)}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-sm"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    {fieldType.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fields List */}
          <div className="space-y-4">
            {formData.fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Field {index + 1}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {fieldTypes.find((t) => t.type === field.type)?.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Name (for data)
                    </label>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        updateField(index, { name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label (visible to users)
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, { label: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) =>
                        updateField(index, { placeholder: e.target.value })
                      }
                      placeholder="Enter placeholder text..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, { required: e.target.checked })
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Required field
                      </span>
                    </label>
                  </div>
                </div>

                {/* Options for select, radio, checkbox */}
                {(field.type === "select" ||
                  field.type === "radio" ||
                  field.type === "checkbox") && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {field.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(index, optionIndex, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                          {field.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {formData.fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No fields added yet</p>
                <p className="text-sm">Add fields using the buttons above</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/forms")}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.fields.length === 0}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Updating..." : "Update Form"}
          </button>
        </div>
      </form>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EditForm;
