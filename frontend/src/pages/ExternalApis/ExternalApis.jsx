import React, { useState, useEffect } from "react";
import {
  Plus,
  ExternalLink,
  Key,
  Activity,
  Globe,
  Shield,
  CheckCircle,
  XCircle,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  BarChart3,
} from "lucide-react";
import { externalApiService } from "../../services/externalApi";
import CreateApiModal from "../../components/ExternalApi/CreateApiModal";
import EditApiModal from "../../components/ExternalApi/EditApiModal";
import ApiStatsModal from "../../components/ExternalApi/ApiStatsModal";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

const ExternalApis = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [copySuccess, setCopySuccess] = useState(new Set());

  useEffect(() => {
    loadApis();
  }, []);

  const loadApis = async () => {
    try {
      setLoading(true);
      const response = await externalApiService.getUserApiConfigs();
      if (response.success) {
        setApis(response.data);
      } else {
        setError("Failed to load APIs");
      }
    } catch (err) {
      setError("Error loading APIs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApi = async (apiData) => {
    try {
      const response = await externalApiService.createApiConfig(apiData);
      if (response.success) {
        await loadApis();
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error("Error creating API:", err);
    }
  };

  const handleUpdateApi = async (apiData) => {
    try {
      const response = await externalApiService.updateApiConfig(
        selectedApi.id,
        apiData
      );
      if (response.success) {
        await loadApis();
        setShowEditModal(false);
        setSelectedApi(null);
      }
    } catch (err) {
      console.error("Error updating API:", err);
    }
  };

  const handleDeleteApi = async () => {
    try {
      const response = await externalApiService.deleteApiConfig(selectedApi.id);
      if (response.success) {
        await loadApis();
        setShowDeleteModal(false);
        setSelectedApi(null);
      }
    } catch (err) {
      console.error("Error deleting API:", err);
    }
  };

  const handleRegenerateKey = async (apiId) => {
    try {
      const response = await externalApiService.regenerateApiKey(apiId);
      if (response.success) {
        await loadApis();
        // Show the new key briefly
        setTimeout(() => {
          setVisibleKeys((prev) => new Set([...prev, apiId]));
          setTimeout(() => {
            setVisibleKeys((prev) => {
              const newSet = new Set(prev);
              newSet.delete(apiId);
              return newSet;
            });
          }, 10000); // Hide after 10 seconds
        }, 100);
      }
    } catch (err) {
      console.error("Error regenerating API key:", err);
    }
  };

  const toggleKeyVisibility = (apiId) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(apiId)) {
        newSet.delete(apiId);
      } else {
        newSet.add(apiId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text, apiId, type) => {
    try {
      await navigator.clipboard.writeText(text);
      const key = `${apiId}-${type}`;
      setCopySuccess((prev) => new Set([...prev, key]));
      setTimeout(() => {
        setCopySuccess((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const getFeatureBadges = (api) => {
    const features = [];
    if (api.cors_enabled)
      features.push({ icon: Globe, text: "CORS", color: "blue" });
    if (api.captcha_enabled)
      features.push({ icon: Shield, text: "CAPTCHA", color: "green" });
    if (api.validation_enabled)
      features.push({ icon: CheckCircle, text: "Validation", color: "purple" });

    return features.map((feature, index) => (
      <span
        key={index}
        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-${feature.color}-100 text-${feature.color}-800 mr-2`}
      >
        <feature.icon className="w-3 h-3 mr-1" />
        {feature.text}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                External APIs
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage external APIs for your forms. Share secure
                endpoints that submit data directly to your Google Sheets.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create API
            </button>
          </div>
        </div>

        {/* APIs Grid */}
        {apis.length === 0 ? (
          <div className="text-center py-12">
            <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No APIs created
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first external API.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create API
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apis.map((api) => (
              <div
                key={api.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {api.api_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Form: {api.form.name}
                      </p>
                    </div>
                    {getStatusBadge(api.is_active)}
                  </div>

                  {/* Description */}
                  {api.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {api.description}
                    </p>
                  )}

                  {/* Features */}
                  <div className="mb-4">{getFeatureBadges(api)}</div>

                  {/* Endpoint */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Endpoint
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded border truncate">
                        {api.endpoint}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `https://sheets.gopafy.com/api.php?path=${encodeURIComponent(
                              api.endpoint.substring(1)
                            )}`,
                            api.id,
                            "endpoint"
                          )
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy endpoint"
                      >
                        {copySuccess.has(`${api.id}-endpoint`) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* API Key */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded border truncate">
                        {visibleKeys.has(api.id) ? api.api_key : "•".repeat(20)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(api.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title={
                          visibleKeys.has(api.id) ? "Hide key" : "Show key"
                        }
                      >
                        {visibleKeys.has(api.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(api.api_key, api.id, "key")
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy API key"
                      >
                        {copySuccess.has(`${api.id}-key`) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Submissions</span>
                      <span className="font-medium text-gray-900">
                        {api.submissions_count}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApi(api);
                          setShowStatsModal(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        title="View statistics"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Stats
                      </button>
                      <a
                        href={`/api/docs/${api.api_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center"
                        title="View documentation"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Docs
                      </a>
                      <a
                        href={`/api/test/${api.api_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center"
                        title="Test API"
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Test
                      </a>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedApi(api);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Edit API"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRegenerateKey(api.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Regenerate API key"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApi(api);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete API"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateApiModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateApi}
          />
        )}

        {showEditModal && selectedApi && (
          <EditApiModal
            api={selectedApi}
            onClose={() => {
              setShowEditModal(false);
              setSelectedApi(null);
            }}
            onSubmit={handleUpdateApi}
          />
        )}

        {showStatsModal && selectedApi && (
          <ApiStatsModal
            api={selectedApi}
            onClose={() => {
              setShowStatsModal(false);
              setSelectedApi(null);
            }}
          />
        )}

        {showDeleteModal && selectedApi && (
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedApi(null);
            }}
            onConfirm={handleDeleteApi}
            title="Delete API"
            message={`Are you sure you want to delete "${selectedApi.api_name}"? This action cannot be undone and will break any applications using this API.`}
          />
        )}
      </div>
    </div>
  );
};

export default ExternalApis;
