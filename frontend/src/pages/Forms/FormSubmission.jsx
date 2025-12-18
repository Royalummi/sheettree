import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Monitor,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import Toast from "../../components/UI/Toast";

const FormSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadSubmissions();
  }, [id, currentPage]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/forms/${id}/submissions?page=${currentPage}&limit=50`
      );
      setForm(response.data.form);
      setSubmissions(response.data.submissions);
      setPagination(response.data.pagination);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load submissions:", error);
      setToast({
        message: error.response?.data?.error || "Failed to load submissions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderFieldValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value || "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Form not found</h3>
              <p className="text-red-700 text-sm mt-1">
                The form you're looking for doesn't exist or you don't have
                access to it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/forms")}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600 mt-1">{form.description}</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Total Submissions
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Direct Submissions
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.direct}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                API/Embed Submissions
              </div>
              <div className="text-3xl font-bold text-green-600">
                {stats.api_embed}
              </div>
            </div>
          </div>
        )}

        {/* Google Sheets Link */}
        {form.connected_sheet && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Connected to Google Sheets
                </p>
                <p className="text-sm text-blue-700">
                  View and edit submissions in your spreadsheet
                </p>
              </div>
            </div>
            <a
              href={`https://docs.google.com/spreadsheets/d/${form.connected_sheet.spreadsheet_id}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Open Sheet
            </a>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Submissions
              {pagination && (
                <span className="text-gray-500 text-base font-normal ml-2">
                  (Page {pagination.page} of {pagination.total_pages})
                </span>
              )}
            </h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-600">
                Submissions will appear here once your form receives responses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="space-y-4 p-6">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Submission Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(submission.created_at)}
                        </span>
                        {submission.source && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              submission.source === "direct"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {submission.source === "direct"
                              ? "Direct"
                              : "API/Embed"}
                          </span>
                        )}
                        {submission.sheet_written && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            ✓ Synced to Sheet
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Submission Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.entries(submission.data).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            {key}
                          </div>
                          <div className="text-sm text-gray-900 break-words">
                            {renderFieldValue(value)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submission Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                      {submission.ip_address && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {submission.ip_address}
                        </span>
                      )}
                      {submission.user_agent && (
                        <span className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" />
                          {submission.user_agent.substring(0, 50)}...
                        </span>
                      )}
                      {submission.origin && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {submission.origin}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} submissions
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.total_pages, prev + 1)
                    )
                  }
                  disabled={pagination.page === pagination.total_pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
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

export default FormSubmission;
