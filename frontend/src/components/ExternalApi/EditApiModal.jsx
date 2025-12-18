import React, { useState, useEffect } from "react";
import { X, Globe, Shield, CheckCircle, AlertCircle, Info } from "lucide-react";

const EditApiModal = ({ api, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    api_name: "",
    description: "",
    is_active: true,
    cors_enabled: false,
    allowed_origins: [""],
    captcha_enabled: false,
    captcha_type: "recaptcha_v3",
    captcha_secret_key: "",
    honeypot_field_name: "website",
    validation_enabled: false,
    required_fields: [""],
    response_type: "json",
    success_message: "Form submitted successfully!",
    redirect_url: "",
    custom_response_data: {},
    field_mapping: {},
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (api) {
      setFormData({
        api_name: api.api_name || "",
        description: api.description || "",
        is_active: api.is_active,
        cors_enabled: api.cors_enabled,
        allowed_origins:
          api.allowed_origins?.length > 0 ? api.allowed_origins : [""],
        captcha_enabled: api.captcha_enabled,
        captcha_type: api.captcha_type || "recaptcha_v3",
        captcha_secret_key: api.captcha_secret_key || "",
        honeypot_field_name: api.honeypot_field_name || "website",
        validation_enabled: api.validation_enabled,
        required_fields:
          api.required_fields?.length > 0 ? api.required_fields : [""],
        response_type: api.response_type || "json",
        success_message: api.success_message || "Form submitted successfully!",
        redirect_url: api.redirect_url || "",
        custom_response_data: api.custom_response_data || {},
        field_mapping: api.field_mapping || {},
      });
    }
  }, [api]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const formErrors = {};

    if (!formData.api_name.trim()) {
      formErrors.api_name = "API name is required";
    }

    if (
      formData.cors_enabled &&
      formData.allowed_origins.filter((origin) => origin.trim()).length === 0
    ) {
      formErrors.allowed_origins =
        "At least one allowed origin is required when CORS is enabled";
    }

    if (formData.captcha_enabled && !formData.captcha_secret_key.trim()) {
      formErrors.captcha_secret_key =
        "CAPTCHA secret key is required when CAPTCHA is enabled";
    }

    if (
      formData.validation_enabled &&
      formData.required_fields.filter((field) => field.trim()).length === 0
    ) {
      formErrors.required_fields =
        "At least one required field must be specified when validation is enabled";
    }

    if (
      formData.response_type === "redirect" &&
      !formData.redirect_url.trim()
    ) {
      formErrors.redirect_url =
        "Redirect URL is required when response type is redirect";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const cleanData = {
        ...formData,
        allowed_origins: formData.allowed_origins.filter((origin) =>
          origin.trim()
        ),
        required_fields: formData.required_fields.filter((field) =>
          field.trim()
        ),
      };

      await onSubmit(cleanData);
    } catch (err) {
      console.error("Error updating API:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!api) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit API Configuration
              </h2>
              <p className="text-sm text-gray-600 mt-1">{api.api_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Name *
                  </label>
                  <input
                    type="text"
                    value={formData.api_name}
                    onChange={(e) =>
                      handleInputChange("api_name", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.api_name ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.api_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.api_name}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleInputChange("is_active", e.target.checked)
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    API is active
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Security Settings
              </h3>

              {/* CORS */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-900">
                        CORS Settings
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cors_enabled}
                          onChange={(e) =>
                            handleInputChange("cors_enabled", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {formData.cors_enabled && (
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          Allowed Origins
                        </label>
                        {formData.allowed_origins.map((origin, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={origin}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "allowed_origins",
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="https://example.com"
                              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            />
                            {formData.allowed_origins.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeArrayField("allowed_origins", index)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayField("allowed_origins")}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          + Add Origin
                        </button>
                        {errors.allowed_origins && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.allowed_origins}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-900">
                        CAPTCHA Protection
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.captcha_enabled}
                          onChange={(e) =>
                            handleInputChange(
                              "captcha_enabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {formData.captcha_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            CAPTCHA Type
                          </label>
                          <select
                            value={formData.captcha_type}
                            onChange={(e) =>
                              handleInputChange("captcha_type", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="recaptcha_v2">
                              Google reCAPTCHA v2
                            </option>
                            <option value="recaptcha_v3">
                              Google reCAPTCHA v3
                            </option>
                            <option value="hcaptcha">hCaptcha</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            Secret Key *
                          </label>
                          <input
                            type="password"
                            value={formData.captcha_secret_key}
                            onChange={(e) =>
                              handleInputChange(
                                "captcha_secret_key",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                              errors.captcha_secret_key
                                ? "border-red-300"
                                : "border-green-300"
                            }`}
                          />
                          {errors.captcha_secret_key && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.captcha_secret_key}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Validation Settings
              </h3>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-purple-900">
                        Form Validation
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.validation_enabled}
                          onChange={(e) =>
                            handleInputChange(
                              "validation_enabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {formData.validation_enabled && (
                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-2">
                          Required Fields
                        </label>
                        {formData.required_fields.map((field, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={field}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "required_fields",
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Field name"
                              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            />
                            {formData.required_fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeArrayField("required_fields", index)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayField("required_fields")}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          + Add Required Field
                        </button>
                        {errors.required_fields && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.required_fields}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Response Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Response Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Type
                  </label>
                  <select
                    value={formData.response_type}
                    onChange={(e) =>
                      handleInputChange("response_type", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="json">JSON Response</option>
                    <option value="redirect">Redirect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Message
                  </label>
                  <input
                    type="text"
                    value={formData.success_message}
                    onChange={(e) =>
                      handleInputChange("success_message", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.response_type === "redirect" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redirect URL *
                  </label>
                  <input
                    type="url"
                    value={formData.redirect_url}
                    onChange={(e) =>
                      handleInputChange("redirect_url", e.target.value)
                    }
                    placeholder="https://example.com/thank-you"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.redirect_url ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.redirect_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.redirect_url}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Settings
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Honeypot Field Name
                </label>
                <input
                  type="text"
                  value={formData.honeypot_field_name}
                  onChange={(e) =>
                    handleInputChange("honeypot_field_name", e.target.value)
                  }
                  placeholder="website"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Field name for spam detection. Should remain empty in
                  legitimate submissions.
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditApiModal;
