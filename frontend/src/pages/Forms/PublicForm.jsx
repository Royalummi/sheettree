import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import publicApi from "../../services/publicApi";
import Toast from "../../components/UI/Toast";

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get(`/form/${id}`);
      const formData = response.data;

      if (!formData.is_active) {
        setToast({
          message: "This form is not currently accepting submissions",
          type: "error",
        });
        return;
      }

      setForm(formData);

      // Initialize form data with empty values
      const initialData = {};
      if (formData.fields) {
        formData.fields.forEach((field) => {
          if (field.type === "checkbox") {
            initialData[field.name] = [];
          } else {
            initialData[field.name] = "";
          }
        });
      }
      setFormData(initialData);
    } catch (error) {
      console.error("Failed to load form:", error);
      setToast({
        message: error.response?.data?.error || "Failed to load form",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  const handleCheckboxChange = (fieldName, optionValue, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName] || [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentValues, optionValue],
        };
      } else {
        return {
          ...prev,
          [fieldName]: currentValues.filter((val) => val !== optionValue),
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (form.fields) {
      form.fields.forEach((field) => {
        if (field.required) {
          const value = formData[field.name];
          if (
            !value ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "string" && value.trim() === "")
          ) {
            newErrors[field.name] = `${field.label} is required`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await publicApi.post(`/form/${id}/submit`, formData);
      setSubmitted(true);
      setToast({ message: "Form submitted successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to submit form:", error);
      setToast({
        message: error.response?.data?.error || "Failed to submit form",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.name];
    const baseClasses = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? "border-red-300" : "border-gray-300"
    }`;

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <input
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseClasses}
            required={field.required}
          />
        );

      case "select":
        return (
          <select
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  className="text-blue-600 focus:ring-blue-500"
                  required={field.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(field.name, option, e.target.checked)
                  }
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Form Not Found
          </h1>
          <p className="text-gray-600">
            The form you're looking for doesn't exist or is not available.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            Your form has been submitted successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({});
              setErrors({});
              setToast(null);
              // Reset form data with empty values for all fields
              if (form?.fields) {
                const initialData = {};
                form.fields.forEach((field) => {
                  if (field.type === "checkbox") {
                    initialData[field.name] = [];
                  } else {
                    initialData[field.name] = "";
                  }
                });
                setFormData(initialData);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields?.map((field, index) => (
              <div key={field.id || index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {renderField(field)}

                {errors[field.name] && (
                  <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
              >
                <Send className="h-5 w-5" />
                {submitting ? "Submitting to Google Sheets..." : "Submit Form"}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default PublicForm;
