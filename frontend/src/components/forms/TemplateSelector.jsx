import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Sparkles,
  FileText,
  Calendar,
  BarChart3,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  GraduationCap,
  Users,
  LayoutGrid,
} from "lucide-react";

// Icon mapping for template icons
const iconComponents = {
  MessageSquare,
  Calendar,
  BarChart3,
  GraduationCap,
  ShoppingCart,
  Sparkles,
  Briefcase,
  FileText,
  Users,
  LayoutGrid,
};

const categoryIcons = {
  contact: MessageSquare,
  registration: FileText,
  survey: BarChart3,
  event: Calendar,
  business: Briefcase,
  order: ShoppingCart,
  application: GraduationCap,
  general: Sparkles,
};

const TemplateSelector = ({ isOpen, onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api.php?path=templates"
      );
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api.php?path=templates/categories"
      );
      const data = await response.json();
      setCategories([
        { value: "all", label: "All Templates", icon: "🎯" },
        ...(data.categories || []),
      ]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = async (template) => {
    try {
      // Record template usage
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:8000/api.php?path=templates/${template.id}/use`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSelectTemplate(template);
      onClose();
    } catch (error) {
      console.error("Failed to record template usage:", error);
      // Still proceed with template selection
      onSelectTemplate(template);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LayoutGrid className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Choose a Template
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <p className="text-blue-100 mt-2">
              Start with a pre-built template or create from scratch
            </p>
          </div>

          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.value] || Sparkles;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.value
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="px-6 py-6 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading templates...</p>
                </div>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No templates found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                  // Get the icon component from the mapping
                  const IconComponent =
                    iconComponents[template.icon] || FileText;

                  return (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-blue-600">
                          <IconComponent className="w-8 h-8" />
                        </div>
                        {template.usage_count > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            {template.usage_count} uses
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Field Count */}
                      <div className="flex items-center text-xs text-gray-500">
                        <FileText className="w-3 h-3 mr-1" />
                        <span>{template.fields?.length || 0} fields</span>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredTemplates.length}</span>{" "}
                template
                {filteredTemplates.length !== 1 ? "s" : ""} available
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
