import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Plus,
  FileText,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  BarChart3,
  Copy,
  Code,
} from "lucide-react";
import { getUserForms, deleteForm } from "../../store/slices/formsSlice";
import { getUserSheets } from "../../store/slices/sheetsSlice";
import Modal from "../../components/UI/Modal";
import Toast from "../../components/UI/Toast";

const Forms = () => {
  const dispatch = useDispatch();
  const { forms, loading, error } = useSelector((state) => state.forms);
  const { sheets } = useSelector((state) => state.sheets);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  // Ensure forms and sheets are arrays
  const formsArray = Array.isArray(forms) ? forms : [];
  const sheetsArray = Array.isArray(sheets) ? sheets : [];

  useEffect(() => {
    dispatch(getUserForms());
    dispatch(getUserSheets());
  }, [dispatch]);

  // Filter forms based on search and filter
  const filteredForms = formsArray.filter((form) => {
    const matchesSearch =
      form.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "active") return matchesSearch && form.is_active;
    if (filterType === "inactive") return matchesSearch && !form.is_active;
    if (filterType === "public") return matchesSearch && form.is_public;
    return matchesSearch;
  });

  const handleDeleteForm = async () => {
    if (!formToDelete) return;

    try {
      await dispatch(deleteForm(formToDelete.id)).unwrap();
      dispatch(getUserForms());
      setToast({ message: "Form deleted successfully!", type: "success" });
      setShowDeleteModal(false);
      setFormToDelete(null);
    } catch (error) {
      console.error("Failed to delete form:", error);
      setToast({ message: error || "Failed to delete form", type: "error" });
    }
  };

  const copyFormUrl = (formId) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    setToast({ message: "Form URL copied to clipboard!", type: "success" });
  };

  const navigateToEmbed = (formId) => {
    window.open(`/embed-forms?formId=${formId}`, "_blank");
  };

  const getFormStats = (form) => {
    return {
      submissions: form.submissions_count || 0,
      fields: Array.isArray(form.fields)
        ? form.fields.length
        : form.fields
        ? JSON.parse(form.fields).length
        : 0,
    };
  };

  // Stats calculations
  const totalForms = formsArray.length;
  const activeForms = formsArray.filter((f) => f.is_active).length;
  const publicForms = formsArray.filter((f) => f.is_public).length;
  const connectedSheets = new Set(
    formsArray.map((f) => f.sheet_id).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
                  <p className="text-gray-600">
                    Create and manage forms that collect data into your Google
                    Sheets
                  </p>
                </div>
              </div>
              <Link
                to="/forms/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Form
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{totalForms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Forms
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeForms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Public Forms
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {publicForms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Connected Sheets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {connectedSheets}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search forms by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="all">All Forms</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                  <option value="public">Public Only</option>
                </select>
              </div>
              <button
                onClick={() => dispatch(getUserForms())}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* No Connected Sheets Warning */}
        {sheetsArray.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-1">
                  No Google Sheets Connected
                </h3>
                <p className="text-amber-700 text-sm mb-4">
                  You need to connect at least one Google Sheet before creating
                  forms to collect data.
                </p>
                <Link
                  to="/sheets"
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Connect Google Sheets
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Loading forms...</p>
          </div>
        )}

        {/* Forms Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => {
              const stats = getFormStats(form);
              return (
                <div
                  key={form.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {form.title}
                        </h3>
                        {form.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {form.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          form.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {form.is_active ? "Active" : "Inactive"}
                      </span>
                      {form.is_public && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          Public
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fields:</span>
                        <span className="font-medium text-gray-900">
                          {stats.fields}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Submissions:</span>
                        <span className="font-medium text-gray-900">
                          {stats.submissions}
                        </span>
                      </div>
                      {form.connected_sheet && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span className="truncate">
                            {form.connected_sheet.spreadsheet_name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Created {new Date(form.created_at).toLocaleDateString()}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/form/${form.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                      <Link
                        to={`/forms/${form.id}/edit`}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => copyFormUrl(form.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </button>
                      <button
                        onClick={() => navigateToEmbed(form.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                      >
                        <Code className="w-4 h-4" />
                        Embed
                      </button>
                      <button
                        onClick={() => {
                          setFormToDelete(form);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium col-span-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredForms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== "all"
                ? "No forms found"
                : "No forms created yet"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search criteria or filter settings"
                : "Create your first form to start collecting data into your Google Sheets"}
            </p>
            {!searchTerm && filterType === "all" && sheetsArray.length > 0 && (
              <Link
                to="/forms/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Form
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Form"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium mb-1">
                Are you sure you want to delete this form?
              </p>
              <p className="text-red-700 text-sm">
                "<strong>{formToDelete?.title}</strong>" and all its submissions
                will be permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteForm}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Form
            </button>
          </div>
        </div>
      </Modal>

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

export default Forms;
