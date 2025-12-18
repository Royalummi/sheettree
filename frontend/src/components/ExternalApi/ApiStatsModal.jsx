import React, { useState, useEffect } from "react";
import {
  X,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { externalApiService } from "../../services/externalApi";

const ApiStatsModal = ({ api, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (api) {
      loadStats();
    }
  }, [api]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await externalApiService.getApiStats(api.id);
      if (response.success) {
        setStats(response.data);
      } else {
        setError("Failed to load statistics");
      }
    } catch (err) {
      setError("Error loading statistics: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (successRate) => {
    if (successRate >= 95) return "text-green-600 bg-green-100";
    if (successRate >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const renderStatCard = (icon, title, value, subtitle, color = "blue") => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center">
        <div
          className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 mr-3`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (!api) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                API Statistics
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

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Overview (Last 30 Days)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderStatCard(
                    <Activity className="w-5 h-5" />,
                    "Total Submissions",
                    formatNumber(stats.total_submissions),
                    null,
                    "blue"
                  )}

                  {renderStatCard(
                    <CheckCircle className="w-5 h-5" />,
                    "Successful",
                    formatNumber(stats.successful_submissions),
                    `${stats.success_rate}% success rate`,
                    "green"
                  )}

                  {renderStatCard(
                    <Shield className="w-5 h-5" />,
                    "Spam Blocked",
                    formatNumber(stats.spam_submissions),
                    `${
                      stats.total_submissions > 0
                        ? Math.round(
                            (stats.spam_submissions / stats.total_submissions) *
                              100
                          )
                        : 0
                    }% of total`,
                    "red"
                  )}

                  {renderStatCard(
                    <TrendingUp className="w-5 h-5" />,
                    "Success Rate",
                    `${stats.success_rate}%`,
                    null,
                    stats.success_rate >= 95
                      ? "green"
                      : stats.success_rate >= 80
                      ? "yellow"
                      : "red"
                  )}
                </div>
              </div>

              {/* Success Rate Indicator */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    API Health
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      stats.success_rate
                    )}`}
                  >
                    {stats.success_rate >= 95
                      ? "Excellent"
                      : stats.success_rate >= 80
                      ? "Good"
                      : "Needs Attention"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stats.success_rate >= 95
                        ? "bg-green-500"
                        : stats.success_rate >= 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(stats.success_rate, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Daily Usage Chart */}
              {stats.daily_usage && stats.daily_usage.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Daily Activity
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {stats.daily_usage.slice(0, 7).map((day, index) => {
                        const maxRequests = Math.max(
                          ...stats.daily_usage.map((d) => d.total_requests)
                        );
                        const widthPercentage =
                          maxRequests > 0
                            ? (day.total_requests / maxRequests) * 100
                            : 0;

                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
                            <div className="w-16 text-sm text-gray-600 font-medium">
                              {formatDate(day.date)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                                    style={{ width: `${widthPercentage}%` }}
                                  ></div>
                                  {day.failed_requests > 0 && (
                                    <div
                                      className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                                      style={{
                                        width: `${
                                          (day.failed_requests / maxRequests) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                  {day.total_requests}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                  {day.successful_requests} successful
                                </span>
                                {day.failed_requests > 0 && (
                                  <span className="flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                    {day.failed_requests} failed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* API Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  API Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Endpoint
                    </span>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {api.endpoint}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Created
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(api.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        api.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {api.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Form
                    </span>
                    <span className="text-sm text-gray-600">
                      {api.form.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                <a
                  href={`/api/docs/${api.api_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Documentation
                </a>
                <a
                  href={`/api/test/${api.api_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Test API
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No data available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Statistics will appear here once your API receives submissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiStatsModal;
