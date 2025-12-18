import React, { useState, useEffect } from "react";
import { X, Globe, Shield, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useSelector } from "react-redux";
import { formsService } from "../../services/forms";

const CreateApiModal = ({ onClose, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    form_id: "",
    api_name: "",
    description: "",
    is_active: true,

    // CORS settings
    cors_enabled: false,
    allowed_origins: [""],

    // Security settings
    captcha_enabled: false,
    captcha_type: "recaptcha_v3",
    captcha_secret_key: "",
    honeypot_field_name: "website",

    // Validation settings
    validation_enabled: false,
    validation_rules: {},
    required_fields: [""],

    // Response settings
    response_type: "json",
    success_message: "Form submitted successfully!",
    redirect_url: "",
    custom_response_data: {},

    // Field mapping
    field_mapping: {},
  });

  const [availableForms, setAvailableForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // Load user's forms - you'll need to implement this API call
    loadUserForms();
  }, []);

  const loadUserForms = async () => {
    try {
      setLoading(true);
      const response = await formsService.getUserForms();
      if (response.forms) {
        // Map the response to the format expected by the dropdown
        const forms = response.forms.map((form) => ({
          id: form.id,
          name: form.title,
          description: form.description || "No description",
        }));
        setAvailableForms(forms);
      } else {
        setAvailableForms([]);
      }
    } catch (err) {
      console.error("Error loading forms:", err);
      setAvailableForms([]);
      // Show error to user
      setErrors((prev) => ({
        ...prev,
        form_id: "Failed to load forms. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
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

  const validateCurrentStep = () => {
    const stepErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.form_id) stepErrors.form_id = "Please select a form";
        if (!formData.api_name.trim())
          stepErrors.api_name = "API name is required";
        break;
      case 2:
        if (
          formData.cors_enabled &&
          formData.allowed_origins.filter((origin) => origin.trim()).length ===
            0
        ) {
          stepErrors.allowed_origins =
            "At least one allowed origin is required when CORS is enabled";
        }
        if (formData.captcha_enabled && !formData.captcha_secret_key.trim()) {
          stepErrors.captcha_secret_key =
            "CAPTCHA secret key is required when CAPTCHA is enabled";
        }
        break;
      case 3:
        if (
          formData.validation_enabled &&
          formData.required_fields.filter((field) => field.trim()).length === 0
        ) {
          stepErrors.required_fields =
            "At least one required field must be specified when validation is enabled";
        }
        break;
      case 4:
        if (
          formData.response_type === "redirect" &&
          !formData.redirect_url.trim()
        ) {
          stepErrors.redirect_url =
            "Redirect URL is required when response type is redirect";
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // Clean up data before submission
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
      console.error("Error creating API:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === currentStep
                ? "bg-purple-600 text-white"
                : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Form *
            </label>
            <select
              value={formData.form_id}
              onChange={(e) => handleInputChange("form_id", e.target.value)}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.form_id ? "border-red-300" : "border-gray-300"
              } ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {loading
                  ? "Loading forms..."
                  : availableForms.length === 0
                  ? "No forms available - create a form first"
                  : "Choose a form..."}
              </option>
              {availableForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name} - {form.description}
                </option>
              ))}
            </select>
            {errors.form_id && (
              <p className="mt-1 text-sm text-red-600">{errors.form_id}</p>
            )}
            {!loading && availableForms.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">No forms found</p>
                    <p className="mt-1">
                      You need to create a form first before you can create an
                      External API.
                      <a
                        href="/forms"
                        className="underline hover:text-yellow-800"
                      >
                        Go to Forms section
                      </a>{" "}
                      to create your first form.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Name *
            </label>
            <input
              type="text"
              value={formData.api_name}
              onChange={(e) => handleInputChange("api_name", e.target.value)}
              placeholder="e.g., Contact Form API"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.api_name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.api_name && (
              <p className="mt-1 text-sm text-red-600">{errors.api_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this API is used for..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-700"
            >
              Enable API immediately
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Security Settings
        </h3>

        {/* CORS Settings */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Globe className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">
                  CORS (Cross-Origin Resource Sharing)
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
              <p className="text-sm text-blue-700 mb-3">
                Allow cross-origin requests from specific domains. Enable this
                if your API will be called from web browsers.
              </p>

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
                        placeholder="https://example.com or *.example.com"
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

        {/* CAPTCHA Settings */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
                      handleInputChange("captcha_enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Protect your API from spam and automated submissions using
                CAPTCHA verification.
              </p>

              {formData.captcha_enabled && (
                <div className="space-y-3">
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
                      <option value="recaptcha_v2">Google reCAPTCHA v2</option>
                      <option value="recaptcha_v3">Google reCAPTCHA v3</option>
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
                        handleInputChange("captcha_secret_key", e.target.value)
                      }
                      placeholder="Your CAPTCHA secret key"
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

        {/* Honeypot Settings */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                Spam Protection
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                Honeypot field name for spam detection. This field should remain
                empty in legitimate submissions.
              </p>
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Honeypot Field Name
                </label>
                <input
                  type="text"
                  value={formData.honeypot_field_name}
                  onChange={(e) =>
                    handleInputChange("honeypot_field_name", e.target.value)
                  }
                  placeholder="website"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                      handleInputChange("validation_enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Enable server-side validation to ensure data quality and prevent
                invalid submissions.
              </p>

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
                        placeholder="Field name (e.g., email, name)"
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
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Response Settings
        </h3>

        <div className="space-y-4">
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
              placeholder="Form submitted successfully!"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {formData.response_type === "redirect" && (
            <div>
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
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create External API
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create API"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateApiModal;
