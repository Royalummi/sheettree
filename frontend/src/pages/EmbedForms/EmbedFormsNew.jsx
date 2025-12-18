import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Code,
  Copy,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Layers,
  ArrowLeft,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  Check,
  ExternalLink,
  Info,
  Palette,
} from "lucide-react";
import { getUserForms } from "../../store/slices/formsSlice";
import { embedService } from "../../services/embedService";
import Toast from "../../components/UI/Toast";

const EmbedForms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forms, loading } = useSelector((state) => state.forms);

  const initialFormId = searchParams.get("formId");

  const [selectedForm, setSelectedForm] = useState(null);
  const [embedOptions, setEmbedOptions] = useState({
    width: "100%",
    height: "600px",
    theme: "light",
    backgroundColor: "#ffffff",
    primaryColor: "#7c3aed",
    textColor: "#1f2937",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    showFormTitle: true,
    formTitleText: "",
    formTitleSize: "24px",
    formTitleColor: "#1f2937",
    formTitleAlign: "left",
    autoResize: true,
    responsive: true,
    hideHeader: false,
    hideFooter: false,
    customCSS: "",
    submitButtonText: "Submit",
    animations: true,
  });

  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [embedCode, setEmbedCode] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState("settings");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formsArray = Array.isArray(forms) ? forms : [];

  useEffect(() => {
    dispatch(getUserForms());
  }, [dispatch]);

  useEffect(() => {
    if (initialFormId && formsArray.length > 0) {
      const form = formsArray.find((f) => f.id === parseInt(initialFormId));
      if (form) {
        setSelectedForm(form);
      }
    }
  }, [initialFormId, formsArray]);

  useEffect(() => {
    if (selectedForm) {
      const code = embedService.generateEmbedCode(
        selectedForm.id,
        embedOptions
      );
      const url = embedService.generateEmbedUrl(selectedForm.id, embedOptions);
      setEmbedCode(code);
      setEmbedUrl(url);
    }
  }, [selectedForm, embedOptions]);

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("formId", form.id);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newParams}`
    );
  };

  const handleOptionChange = (key, value) => {
    setEmbedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedCode(true);
      setToast({ message: "Embed code copied!", type: "success" });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      setToast({ message: "Failed to copy code", type: "error" });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      setCopiedUrl(true);
      setToast({ message: "URL copied!", type: "success" });
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      setToast({ message: "Failed to copy URL", type: "error" });
    }
  };

  const filteredForms = formsArray.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.description &&
        form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/forms")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Embed Forms Generator
                  </h1>
                  <p className="text-sm text-gray-600">
                    Configure, preview, and get embed code
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  CORS-ready
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Auto-responsive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {formsArray.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Forms Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Create your first form to start generating embed codes and
                collecting data from your website visitors.
              </p>
              <button
                onClick={() => navigate("/forms")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-2" />
                Create Your First Form
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Form Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Select Form</h3>
                    <p className="text-sm text-gray-600">
                      Choose a form to generate embed code
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <span className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg whitespace-nowrap">
                    {filteredForms.length}{" "}
                    {filteredForms.length === 1 ? "form" : "forms"}
                  </span>
                </div>
              </div>

              {/* Forms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2">
                {filteredForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => handleFormSelect(form)}
                    className={`group p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedForm?.id === form.id
                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md scale-[1.02]"
                        : "border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                        {form.title}
                      </h4>
                      {selectedForm?.id === form.id && (
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 ml-1" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          form.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {form.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {form.submissions_count || 0} submissions
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen Layout */}
            {selectedForm ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT PANEL - Configuration & Code */}
                <div className="space-y-6">
                  {/* Selected Form Card */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2">
                          {selectedForm.title}
                        </h2>
                        {selectedForm.description && (
                          <p className="text-purple-100 text-sm line-clamp-2">
                            {selectedForm.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          selectedForm.is_active
                            ? "bg-green-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {selectedForm.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>ID: {selectedForm.id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {selectedForm.submissions_count || 0} submissions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveSection("settings")}
                        className={`flex-1 flex items-center justify-center px-6 py-4 font-medium text-sm transition-all ${
                          activeSection === "settings"
                            ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </button>
                      <button
                        onClick={() => setActiveSection("code")}
                        className={`flex-1 flex items-center justify-center px-6 py-4 font-medium text-sm transition-all ${
                          activeSection === "code"
                            ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Get Code
                      </button>
                    </div>

                    <div className="p-6 max-h-[calc(100vh-480px)] overflow-y-auto">
                      {activeSection === "settings" ? (
                        <div className="space-y-6">
                          {/* Dimensions */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <Monitor className="w-4 h-4 mr-2 text-purple-600" />
                              Dimensions
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Width
                                </label>
                                <input
                                  type="text"
                                  value={embedOptions.width}
                                  onChange={(e) =>
                                    handleOptionChange("width", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="100%, 500px"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Height
                                </label>
                                <input
                                  type="text"
                                  value={embedOptions.height}
                                  onChange={(e) =>
                                    handleOptionChange("height", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="600px, 400px"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Appearance */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <Palette className="w-4 h-4 mr-2 text-purple-600" />
                              Appearance
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Theme
                                </label>
                                <select
                                  value={embedOptions.theme}
                                  onChange={(e) =>
                                    handleOptionChange("theme", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="light">Light Theme</option>
                                  <option value="dark">Dark Theme</option>
                                  <option value="auto">Auto (System)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Background Color
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="color"
                                    value={embedOptions.backgroundColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "backgroundColor",
                                        e.target.value
                                      )
                                    }
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={embedOptions.backgroundColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "backgroundColor",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="#ffffff"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Primary Color
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="color"
                                    value={embedOptions.primaryColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "primaryColor",
                                        e.target.value
                                      )
                                    }
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={embedOptions.primaryColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "primaryColor",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="#7c3aed"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Text Color
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="color"
                                    value={embedOptions.textColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "textColor",
                                        e.target.value
                                      )
                                    }
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={embedOptions.textColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "textColor",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="#1f2937"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Border Radius
                                </label>
                                <select
                                  value={embedOptions.borderRadius}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "borderRadius",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="0px">None (Square)</option>
                                  <option value="4px">Small (4px)</option>
                                  <option value="8px">Medium (8px)</option>
                                  <option value="12px">Large (12px)</option>
                                  <option value="16px">
                                    Extra Large (16px)
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Border Width
                                </label>
                                <select
                                  value={embedOptions.borderWidth}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "borderWidth",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="0px">None</option>
                                  <option value="1px">Thin (1px)</option>
                                  <option value="2px">Medium (2px)</option>
                                  <option value="3px">Thick (3px)</option>
                                  <option value="4px">Extra Thick (4px)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Border Style
                                </label>
                                <select
                                  value={embedOptions.borderStyle}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "borderStyle",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="groove">Groove</option>
                                  <option value="ridge">Ridge</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Border Color
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="color"
                                    value={embedOptions.borderColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "borderColor",
                                        e.target.value
                                      )
                                    }
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={embedOptions.borderColor}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "borderColor",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="#e5e7eb"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Submit Button Text
                                </label>
                                <input
                                  type="text"
                                  value={embedOptions.submitButtonText}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "submitButtonText",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Submit, Send, etc."
                                />
                              </div>
                            </div>
                          </div>

                          {/* Typography */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-purple-600" />
                              Typography
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Font Family
                                </label>
                                <select
                                  value={embedOptions.fontFamily}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "fontFamily",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="Arial, sans-serif">
                                    Arial
                                  </option>
                                  <option value="'Helvetica Neue', Helvetica, sans-serif">
                                    Helvetica
                                  </option>
                                  <option value="'Segoe UI', Tahoma, Geneva, sans-serif">
                                    Segoe UI
                                  </option>
                                  <option value="Georgia, serif">
                                    Georgia
                                  </option>
                                  <option value="'Times New Roman', Times, serif">
                                    Times New Roman
                                  </option>
                                  <option value="'Courier New', Courier, monospace">
                                    Courier New
                                  </option>
                                  <option value="'Trebuchet MS', sans-serif">
                                    Trebuchet MS
                                  </option>
                                  <option value="Verdana, sans-serif">
                                    Verdana
                                  </option>
                                  <option value="'Comic Sans MS', cursive">
                                    Comic Sans MS
                                  </option>
                                  <option value="Impact, sans-serif">
                                    Impact
                                  </option>
                                  <option value="'Lucida Console', monospace">
                                    Lucida Console
                                  </option>
                                  <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">
                                    Palatino
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Font Size
                                </label>
                                <select
                                  value={embedOptions.fontSize}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "fontSize",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="12px">
                                    Extra Small (12px)
                                  </option>
                                  <option value="14px">Small (14px)</option>
                                  <option value="16px">Medium (16px)</option>
                                  <option value="18px">Large (18px)</option>
                                  <option value="20px">
                                    Extra Large (20px)
                                  </option>
                                  <option value="24px">Huge (24px)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Form Title/Header */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-purple-600" />
                              Form Title
                            </h4>
                            <div className="space-y-4">
                              <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={embedOptions.showFormTitle}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      "showFormTitle",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-3"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Show Form Title
                                </span>
                              </label>
                              {embedOptions.showFormTitle && (
                                <>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                      Custom Title Text (leave empty to use form
                                      title)
                                    </label>
                                    <input
                                      type="text"
                                      value={embedOptions.formTitleText}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "formTitleText",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="Enter custom title..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                      Title Size
                                    </label>
                                    <select
                                      value={embedOptions.formTitleSize}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "formTitleSize",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value="18px">Small (18px)</option>
                                      <option value="20px">
                                        Medium (20px)
                                      </option>
                                      <option value="24px">Large (24px)</option>
                                      <option value="28px">
                                        Extra Large (28px)
                                      </option>
                                      <option value="32px">Huge (32px)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                      Title Color
                                    </label>
                                    <div className="flex space-x-2">
                                      <input
                                        type="color"
                                        value={embedOptions.formTitleColor}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            "formTitleColor",
                                            e.target.value
                                          )
                                        }
                                        className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={embedOptions.formTitleColor}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            "formTitleColor",
                                            e.target.value
                                          )
                                        }
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="#1f2937"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                      Title Alignment
                                    </label>
                                    <select
                                      value={embedOptions.formTitleAlign}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "formTitleAlign",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value="left">Left</option>
                                      <option value="center">Center</option>
                                      <option value="right">Right</option>
                                    </select>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                              Features
                            </h4>
                            <div className="space-y-3">
                              {[
                                {
                                  key: "autoResize",
                                  label: "Auto-resize",
                                  icon: Zap,
                                },
                                {
                                  key: "responsive",
                                  label: "Responsive",
                                  icon: Layers,
                                },
                                {
                                  key: "hideHeader",
                                  label: "Hide Description",
                                  icon: Eye,
                                },
                                {
                                  key: "hideFooter",
                                  label: "Hide Footer",
                                  icon: Eye,
                                },
                                {
                                  key: "animations",
                                  label: "Animations",
                                  icon: Sparkles,
                                },
                              ].map(({ key, label, icon: Icon }) => (
                                <label
                                  key={key}
                                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={embedOptions[key]}
                                    onChange={(e) =>
                                      handleOptionChange(key, e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-3"
                                  />
                                  <Icon className="w-4 h-4 text-gray-600 mr-2" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Advanced */}
                          <div>
                            <button
                              onClick={() => setShowAdvanced(!showAdvanced)}
                              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors mb-3"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Advanced Options
                              {showAdvanced ? (
                                <ChevronUp className="w-4 h-4 ml-1" />
                              ) : (
                                <ChevronDown className="w-4 h-4 ml-1" />
                              )}
                            </button>

                            {showAdvanced && (
                              <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Custom CSS
                                  </label>
                                  <textarea
                                    value={embedOptions.customCSS}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "customCSS",
                                        e.target.value
                                      )
                                    }
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs"
                                    placeholder="/* Example: */&#10;.sheettree-form-container { padding: 30px; }&#10;.form-title { font-weight: bold; }&#10;.form-input { border-width: 2px; }&#10;.submit-button { background: linear-gradient(...); }"
                                  />
                                  <p className="text-xs text-gray-500 mt-2">
                                    Add custom styles to override default
                                    styling
                                  </p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <h5 className="text-xs font-bold text-blue-900 mb-3 flex items-center">
                                    <Info className="w-4 h-4 mr-2" />
                                    Available CSS Classes
                                  </h5>
                                  <div className="space-y-2 text-xs text-blue-800">
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .sheettree-form-container
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Main container wrapper
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .sheettree-form
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Form element
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .form-title
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Form title/header
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .form-description
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Form description text
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .form-field
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Individual field wrapper
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .field-label
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Field label
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .form-input
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Input fields (text, email, etc.)
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .submit-button
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Submit button
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .form-message
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Success/error messages
                                      </p>
                                    </div>
                                    <div className="font-mono bg-white p-2 rounded border border-blue-200">
                                      <span className="font-semibold text-blue-600">
                                        .sheettree-branding
                                      </span>
                                      <p className="text-gray-600 ml-4 mt-1">
                                        Footer branding
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-900 mb-2">
                                      💡 Example Usage:
                                    </p>
                                    <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                      {`/* Change form background */
.sheettree-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
}

/* Style input fields */
.form-input {
  border: 2px solid #667eea;
  border-radius: 10px;
}

.form-input:focus {
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

/* Customize submit button */
.submit-button {
  background: #667eea;
  padding: 16px 32px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-button:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}`}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Embed Code */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                <Code className="w-4 h-4 mr-2 text-purple-600" />
                                Embed Code
                              </h4>
                              <button
                                onClick={handleCopyCode}
                                className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
                              >
                                {copiedCode ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                {copiedCode ? "Copied!" : "Copy Code"}
                              </button>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                                <code>{embedCode}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Direct URL */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                <ExternalLink className="w-4 h-4 mr-2 text-purple-600" />
                                Direct Embed URL
                              </h4>
                              <button
                                onClick={handleCopyUrl}
                                className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                              >
                                {copiedUrl ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                {copiedUrl ? "Copied!" : "Copy URL"}
                              </button>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <code className="text-xs text-gray-700 break-all">
                                {embedUrl}
                              </code>
                            </div>
                          </div>

                          {/* Features Info */}
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                            <h5 className="font-semibold text-blue-900 mb-3 flex items-center text-sm">
                              <Info className="w-4 h-4 mr-2" />
                              What's Included
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                "CORS-enabled for cross-origin embedding",
                                "Auto-resize for dynamic content",
                                "Mobile-responsive design",
                                "Secure form submissions",
                                "Custom styling support",
                                "Real-time validation",
                              ].map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-start text-xs text-blue-800"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL - Live Preview */}
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Preview Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <Eye className="w-5 h-5 mr-2 text-purple-600" />
                          Live Preview
                        </h3>
                        <div className="flex items-center space-x-2">
                          {[
                            { key: "desktop", icon: Monitor, label: "Desktop" },
                            { key: "tablet", icon: Tablet, label: "Tablet" },
                            {
                              key: "mobile",
                              icon: Smartphone,
                              label: "Mobile",
                            },
                          ].map(({ key, icon: Icon, label }) => (
                            <button
                              key={key}
                              onClick={() => setPreviewDevice(key)}
                              title={label}
                              className={`p-2 rounded-lg border transition-all ${
                                previewDevice === key
                                  ? "border-purple-500 bg-purple-50 text-purple-700"
                                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Preview updates automatically as you change settings
                      </p>
                    </div>

                    {/* Preview Frame */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 min-h-[600px]">
                      <div
                        className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                          previewDevice === "mobile"
                            ? "max-w-[375px]"
                            : previewDevice === "tablet"
                            ? "max-w-[768px]"
                            : "w-full"
                        }`}
                      >
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            width="100%"
                            height={
                              previewDevice === "mobile"
                                ? "500px"
                                : previewDevice === "tablet"
                                ? "600px"
                                : "650px"
                            }
                            frameBorder="0"
                            className="w-full bg-white"
                            title={`${previewDevice} preview of ${selectedForm.title}`}
                          />
                        ) : (
                          <div className="p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h6 className="text-lg font-medium text-gray-900 mb-2">
                              No Preview Available
                            </h6>
                            <p className="text-gray-600 text-sm">
                              Configure your form settings to see the preview.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                          Viewing {previewDevice} preview
                          {previewDevice === "mobile" && " (375px)"}
                          {previewDevice === "tablet" && " (768px)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Select a Form
                  </h3>
                  <p className="text-gray-600">
                    Choose a form from the options above to start configuring
                    your embed code and preview.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

export default EmbedForms;
