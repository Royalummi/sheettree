import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Code,
  Copy,
  Eye,
  Settings,
  CheckCircle,
  Zap,
  FileText,
  Shield,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Download,
  Palette,
  Layout,
  Sparkles,
  ChevronDown,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  Info,
  Clock,
} from "lucide-react";
import { getUserForms } from "../../store/slices/formsSlice";
import { embedService } from "../../services/embedService";
import Toast from "../../components/UI/Toast";

const DEVICE_PRESETS = {
  desktop: { width: 1440, scale: 1, icon: Monitor },
  tablet: { width: 768, scale: 0.75, icon: Tablet },
  mobile: { width: 375, scale: 0.85, icon: Smartphone },
};

const CODE_FORMATS = [
  { id: "html", label: "HTML", language: "html" },
  { id: "react", label: "React", language: "jsx" },
  { id: "vue", label: "Vue", language: "html" },
  { id: "wordpress", label: "WordPress", language: "php" },
  { id: "webflow", label: "Webflow", language: "html" },
];

const EmbedForms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forms, loading } = useSelector((state) => state.forms);
  const previewIframeRef = useRef(null);
  const updateTimerRef = useRef(null);

  const initialFormId = searchParams.get("formId");
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFormDropdown, setShowFormDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentForms, setRecentForms] = useState([]);

  const [embedOptions, setEmbedOptions] = useState({
    // Dimensions
    width: "100%",
    height: "600px",
    responsive: true,
    // Theme & Colors
    theme: "light",
    backgroundColor: "#ffffff",
    primaryColor: "#7c3aed",
    textColor: "#1f2937",
    borderColor: "#e5e7eb",
    // Appearance
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    padding: "20px",
    submitButtonText: "Submit",
    // Typography
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    // Form Title
    showFormTitle: true,
    formTitleText: "",
    formTitleSize: "24px",
    formTitleColor: "#1f2937",
    formTitleAlign: "left",
    // Features
    autoResize: true,
    animations: true,
    hideHeader: false,
    hideFooter: false,
    // Advanced
    customCSS: "",
  });

  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [embedCode, setEmbedCode] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [currentCodeFormat, setCurrentCodeFormat] = useState("html");
  const [toast, setToast] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [expandedSections, setExpandedSections] = useState([
    "dimensions",
    "theme",
  ]);

  const formsArray = Array.isArray(forms) ? forms : [];

  useEffect(() => {
    dispatch(getUserForms());
    loadRecentForms();
  }, [dispatch]);

  useEffect(() => {
    if (initialFormId && formsArray.length > 0 && !selectedForm) {
      const form = formsArray.find((f) => f.id === parseInt(initialFormId));
      if (form) {
        setSelectedForm(form);
        setShowFormDropdown(false);
        setIsCodeGenerated(false);
        setEmbedCode("");
        setEmbedUrl("");
        saveToRecentForms(form);
      }
    }
  }, [initialFormId, formsArray.length]);

  // Debounced preview update
  useEffect(() => {
    if (selectedForm) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = setTimeout(() => {
        const url = embedService.generateEmbedUrl(
          selectedForm.id,
          embedOptions
        );
        setEmbedUrl(url);
        setPreviewKey((prev) => prev + 1);
      }, 300);
    }
    return () => clearTimeout(updateTimerRef.current);
  }, [embedOptions, selectedForm]);

  const loadRecentForms = () => {
    const recent = JSON.parse(localStorage.getItem("recentForms") || "[]");
    setRecentForms(recent.slice(0, 3));
  };

  const saveToRecentForms = (form) => {
    let recent = JSON.parse(localStorage.getItem("recentForms") || "[]");
    recent = recent.filter((f) => f.id !== form.id);
    recent.unshift({ id: form.id, title: form.title });
    recent = recent.slice(0, 5);
    localStorage.setItem("recentForms", JSON.stringify(recent));
    setRecentForms(recent.slice(0, 3));
  };

  const selectForm = (form) => {
    setSelectedForm(form);
    setShowFormDropdown(false);
    setIsCodeGenerated(false);
    setEmbedCode("");
    setEmbedUrl("");
    saveToRecentForms(form);
    // Preview will auto-update via useEffect
  };

  const handleOptionChange = (key, value) => {
    setEmbedOptions((prev) => ({ ...prev, [key]: value }));
    if (isCodeGenerated) {
      regenerateCode();
    }
  };

  const applyPreset = (presetName) => {
    const presets = embedService.getThemePresets();
    const preset = presets[presetName];
    if (preset) {
      setEmbedOptions((prev) => ({ ...prev, ...preset }));
      setToast({
        message: `Applied ${presetName} theme preset`,
        type: "success",
      });
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleGenerateCode = () => {
    if (!selectedForm) return;

    const code = embedService.getCodeByFormat(
      currentCodeFormat,
      selectedForm.id,
      embedOptions
    );
    const url = embedService.generateEmbedUrl(selectedForm.id, embedOptions);

    setEmbedCode(code);
    setEmbedUrl(url);
    setIsCodeGenerated(true);
    setToast({
      message: "Embed code generated successfully!",
      type: "success",
    });

    // Scroll to code section
    setTimeout(() => {
      document
        .getElementById("code-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const regenerateCode = () => {
    if (selectedForm && isCodeGenerated) {
      const code = embedService.getCodeByFormat(
        currentCodeFormat,
        selectedForm.id,
        embedOptions
      );
      const url = embedService.generateEmbedUrl(selectedForm.id, embedOptions);
      setEmbedCode(code);
      setEmbedUrl(url);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedCode(true);
      setToast({ message: "Code copied to clipboard!", type: "success" });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      setToast({ message: "Failed to copy code", type: "error" });
    }
  };

  const handleDownloadCode = () => {
    const filename = `embed-form-${selectedForm.id}.${
      currentCodeFormat === "html"
        ? "html"
        : currentCodeFormat === "react"
        ? "jsx"
        : currentCodeFormat === "vue"
        ? "vue"
        : "txt"
    }`;
    const blob = new Blob([embedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ message: "Code downloaded!", type: "success" });
  };

  const filteredForms = formsArray.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentFormObjects = recentForms
    .map((rf) => formsArray.find((f) => f.id === rf.id))
    .filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading forms...</p>
        </div>
      </div>
    );
  }

  if (!selectedForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Select a Form to Embed
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose which form you want to embed on your website
                </p>
              </div>
              <button
                onClick={() => navigate("/forms")}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {recentFormObjects.length > 0 && !searchQuery && (
              <div className="mb-6">
                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {recentFormObjects.map((form) => (
                    <FormCard key={form.id} form={form} onSelect={selectForm} />
                  ))}
                </div>
              </div>
            )}

            {formsArray.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Forms Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a form first to generate embed codes
                </p>
                <button
                  onClick={() => navigate("/forms")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Form
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {searchQuery ? "Search Results" : "All Forms"} (
                  {filteredForms.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredForms.map((form) => (
                    <FormCard key={form.id} form={form} onSelect={selectForm} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* LEFT: Configuration Panel */}
      <div className="w-full lg:w-[45%] flex flex-col bg-white border-r border-gray-200 overflow-hidden">
        {/* Header with Form Selector */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <button
                onClick={() => setShowFormDropdown(!showFormDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {selectedForm.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedForm.submissions_count || 0} submissions ·{" "}
                      {selectedForm.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              {showFormDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFormDropdown(false)}
                  ></div>
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search forms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="py-2">
                      {filteredForms.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => selectForm(form)}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            {form.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {form.submissions_count || 0} submissions
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600 ml-4">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure</span>
            </div>
          </div>
        </div>

        {/* Configuration Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Theme Presets */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              Quick Start Presets
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(embedService.getThemePresets()).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all capitalize text-sm font-medium"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3">
            <ConfigSection
              title="Dimensions"
              icon={Layout}
              expanded={expandedSections.includes("dimensions")}
              onToggle={() => toggleSection("dimensions")}
            >
              <div className="space-y-4">
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
                    placeholder="100%, 800px, etc."
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
                    placeholder="600px, 400px, etc."
                  />
                </div>
                <label className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={embedOptions.responsive}
                    onChange={(e) =>
                      handleOptionChange("responsive", e.target.checked)
                    }
                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      Responsive
                    </div>
                    <div className="text-xs text-gray-600">
                      Adapt to all screen sizes
                    </div>
                  </div>
                </label>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Theme & Colors"
              icon={Palette}
              expanded={expandedSections.includes("theme")}
              onToggle={() => toggleSection("theme")}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOptionChange("theme", "light")}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        embedOptions.theme === "light"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleOptionChange("theme", "dark")}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        embedOptions.theme === "dark"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                <ColorPicker
                  label="Background Color"
                  value={embedOptions.backgroundColor}
                  onChange={(value) =>
                    handleOptionChange("backgroundColor", value)
                  }
                />
                <ColorPicker
                  label="Primary Color"
                  value={embedOptions.primaryColor}
                  onChange={(value) =>
                    handleOptionChange("primaryColor", value)
                  }
                />
                <ColorPicker
                  label="Text Color"
                  value={embedOptions.textColor}
                  onChange={(value) => handleOptionChange("textColor", value)}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Border Radius
                  </label>
                  <select
                    value={embedOptions.borderRadius}
                    onChange={(e) =>
                      handleOptionChange("borderRadius", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="0px">None</option>
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="16px">Extra Large (16px)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Border Width
                  </label>
                  <select
                    value={embedOptions.borderWidth}
                    onChange={(e) =>
                      handleOptionChange("borderWidth", e.target.value)
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
                      handleOptionChange("borderStyle", e.target.value)
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
                <ColorPicker
                  label="Border Color"
                  value={embedOptions.borderColor}
                  onChange={(value) => handleOptionChange("borderColor", value)}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={embedOptions.submitButtonText}
                    onChange={(e) =>
                      handleOptionChange("submitButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Typography"
              icon={FileText}
              expanded={expandedSections.includes("typography")}
              onToggle={() => toggleSection("typography")}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={embedOptions.fontFamily}
                    onChange={(e) =>
                      handleOptionChange("fontFamily", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Helvetica Neue', Helvetica, sans-serif">
                      Helvetica
                    </option>
                    <option value="'Segoe UI', Tahoma, Geneva, sans-serif">
                      Segoe UI
                    </option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', Times, serif">
                      Times New Roman
                    </option>
                    <option value="'Courier New', Courier, monospace">
                      Courier New
                    </option>
                    <option value="'Trebuchet MS', sans-serif">
                      Trebuchet MS
                    </option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Comic Sans MS', cursive">
                      Comic Sans MS
                    </option>
                    <option value="Impact, sans-serif">Impact</option>
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
                      handleOptionChange("fontSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="12px">Extra Small (12px)</option>
                    <option value="14px">Small (14px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="18px">Large (18px)</option>
                    <option value="20px">Extra Large (20px)</option>
                    <option value="24px">Huge (24px)</option>
                  </select>
                </div>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Form Title"
              icon={FileText}
              expanded={expandedSections.includes("formtitle")}
              onToggle={() => toggleSection("formtitle")}
            >
              <div className="space-y-4">
                <label className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={embedOptions.showFormTitle}
                    onChange={(e) =>
                      handleOptionChange("showFormTitle", e.target.checked)
                    }
                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      Show Form Title
                    </div>
                    <div className="text-xs text-gray-600">
                      Display title above form
                    </div>
                  </div>
                </label>
                {embedOptions.showFormTitle && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Custom Title Text (leave empty to use form title)
                      </label>
                      <input
                        type="text"
                        value={embedOptions.formTitleText}
                        onChange={(e) =>
                          handleOptionChange("formTitleText", e.target.value)
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
                          handleOptionChange("formTitleSize", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="18px">Small (18px)</option>
                        <option value="20px">Medium (20px)</option>
                        <option value="24px">Large (24px)</option>
                        <option value="28px">Extra Large (28px)</option>
                        <option value="32px">Huge (32px)</option>
                      </select>
                    </div>
                    <ColorPicker
                      label="Title Color"
                      value={embedOptions.formTitleColor}
                      onChange={(value) =>
                        handleOptionChange("formTitleColor", value)
                      }
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Title Alignment
                      </label>
                      <select
                        value={embedOptions.formTitleAlign}
                        onChange={(e) =>
                          handleOptionChange("formTitleAlign", e.target.value)
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
            </ConfigSection>

            <ConfigSection
              title="Features"
              icon={Zap}
              expanded={expandedSections.includes("features")}
              onToggle={() => toggleSection("features")}
            >
              <div className="space-y-3">
                {[
                  {
                    key: "autoResize",
                    label: "Auto-resize",
                    desc: "Automatically adjust height",
                  },
                  {
                    key: "animations",
                    label: "Animations",
                    desc: "Smooth transitions",
                  },
                  {
                    key: "hideHeader",
                    label: "Hide Header",
                    desc: "Remove form title",
                  },
                  {
                    key: "hideFooter",
                    label: "Hide Footer",
                    desc: "Remove form footer",
                  },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={embedOptions[key]}
                      onChange={(e) =>
                        handleOptionChange(key, e.target.checked)
                      }
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {label}
                      </div>
                      <div className="text-xs text-gray-600">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </ConfigSection>

            <ConfigSection
              title="Advanced CSS"
              icon={Code}
              expanded={expandedSections.includes("advanced")}
              onToggle={() => toggleSection("advanced")}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Custom CSS
                  </label>
                  <textarea
                    value={embedOptions.customCSS}
                    onChange={(e) =>
                      handleOptionChange("customCSS", e.target.value)
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="/* Example: */&#10;.sheettree-form-container { padding: 30px; }&#10;.form-title { font-weight: bold; }&#10;.form-input { border-width: 2px; }&#10;.submit-button { background: linear-gradient(...); }"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Add custom styles to override default styling
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
                      <p className="text-gray-600 ml-4 mt-1">Form element</p>
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
                      <p className="text-gray-600 ml-4 mt-1">Field label</p>
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
                      <p className="text-gray-600 ml-4 mt-1">Submit button</p>
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
                      <p className="text-gray-600 ml-4 mt-1">Footer branding</p>
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
            </ConfigSection>
          </div>

          {/* Generate Button */}
          {!isCodeGenerated && (
            <div className="mt-8">
              <button
                onClick={handleGenerateCode}
                className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Embed Code</span>
              </button>
            </div>
          )}

          {/* Generated Code Section */}
          {isCodeGenerated && (
            <div id="code-section" className="mt-8 space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Embed Code Generated!</span>
              </div>

              {/* Code Format Tabs */}
              <div>
                <div className="flex space-x-2 border-b border-gray-200 mb-4">
                  {CODE_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => {
                        setCurrentCodeFormat(format.id);
                        if (selectedForm && isCodeGenerated) {
                          const code = embedService.getCodeByFormat(
                            format.id,
                            selectedForm.id,
                            embedOptions
                          );
                          setEmbedCode(code);
                        }
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-all ${
                        currentCodeFormat === format.id
                          ? "text-purple-700 border-b-2 border-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div className="relative">
                  <div className="absolute top-3 right-3 flex space-x-2 z-10">
                    <button
                      onClick={handleDownloadCode}
                      className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-2"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                      {embedCode}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Test URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Test URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={embedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(embedUrl);
                      setToast({ message: "URL copied!", type: "success" });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Code auto-updates</p>
                    <p>
                      When you change settings above, your embed code will
                      automatically regenerate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="hidden lg:flex lg:w-[55%] flex-col bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Preview Controls */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <Eye className="w-4 h-4 mr-2 text-purple-600" />
            Live Preview
          </h3>
          <div className="flex items-center space-x-2">
            {Object.entries(DEVICE_PRESETS).map(([key, { icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setPreviewDevice(key)}
                className={`p-2 rounded-lg transition-colors ${
                  previewDevice === key
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={key}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button
              onClick={() => setPreviewKey((prev) => prev + 1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          {selectedForm && embedUrl ? (
            <div
              className="bg-white shadow-2xl transition-all duration-300"
              style={{
                width: `${DEVICE_PRESETS[previewDevice].width}px`,
                transform: `scale(${DEVICE_PRESETS[previewDevice].scale})`,
                borderRadius: embedOptions.borderRadius,
              }}
            >
              <iframe
                key={previewKey}
                ref={previewIframeRef}
                src={embedUrl}
                className="w-full border-0"
                style={{ height: embedOptions.height }}
                title={`Preview of ${selectedForm.title}`}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          ) : (
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a form to see preview</p>
            </div>
          )}
        </div>
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

// Helper Components
const FormCard = ({ form, onSelect }) => (
  <button
    onClick={() => onSelect(form)}
    className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-left transition-all group"
  >
    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-700">
      {form.title}
    </h3>
    {form.description && (
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {form.description}
      </p>
    )}
    <div className="flex items-center justify-between text-xs">
      <span
        className={`px-2 py-1 rounded-full font-medium ${
          form.is_active
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {form.is_active ? "Active" : "Inactive"}
      </span>
      <span className="text-gray-500">
        {form.submissions_count || 0} submissions
      </span>
    </div>
  </button>
);

const ConfigSection = ({ title, icon: Icon, expanded, onToggle, children }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-purple-600" />
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 transition-transform ${
          expanded ? "transform rotate-180" : ""
        }`}
      />
    </button>
    {expanded && <div className="p-4 bg-white">{children}</div>}
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex space-x-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default EmbedForms;
