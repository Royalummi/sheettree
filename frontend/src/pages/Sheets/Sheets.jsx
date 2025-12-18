import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Plus,
  FileSpreadsheet,
  ExternalLink,
  Trash2,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  getUserSheets,
  connectSheet,
  disconnectSheet,
} from "../../store/slices/sheetsSlice";
import Modal from "../../components/UI/Modal";
import Toast from "../../components/UI/Toast";

const Sheets = () => {
  const dispatch = useDispatch();
  const { sheets, loading, error } = useSelector((state) => state.sheets);
  const { user } = useSelector((state) => state.auth);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [toast, setToast] = useState(null);
  const [connectForm, setConnectForm] = useState({
    spreadsheet_id: "",
    spreadsheet_name: "",
    sheet_name: "Sheet1",
    connection_type: "private",
  });

  // Ensure sheets is an array
  const sheetsArray = Array.isArray(sheets) ? sheets : [];

  useEffect(() => {
    dispatch(getUserSheets());
  }, [dispatch]);

  // Filter sheets based on search and filter
  const filteredSheets = sheetsArray.filter((sheet) => {
    const matchesSearch =
      sheet.spreadsheet_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sheet.sheet_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && sheet.connection_type === filterType;
  });

  const handleConnectSheet = async (e) => {
    e.preventDefault();
    try {
      await dispatch(connectSheet(connectForm)).unwrap();
      setShowConnectModal(false);
      setConnectForm({
        spreadsheet_id: "",
        spreadsheet_name: "",
        sheet_name: "Sheet1",
        connection_type: "private",
      });
      // Refresh the sheets list
      dispatch(getUserSheets());
      setToast({ message: "Sheet connected successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to connect sheet:", error);
      setToast({ message: error || "Failed to connect sheet", type: "error" });
    }
  };

  const handleDisconnectSheet = async (sheetId) => {
    if (window.confirm("Are you sure you want to disconnect this sheet?")) {
      try {
        await dispatch(disconnectSheet(sheetId)).unwrap();
        dispatch(getUserSheets());
        setToast({
          message: "Sheet disconnected successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Failed to disconnect sheet:", error);
        setToast({
          message: error || "Failed to disconnect sheet",
          type: "error",
        });
      }
    }
  };

  const extractSpreadsheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleUrlPaste = (e) => {
    const url = e.target.value;
    const spreadsheetId = extractSpreadsheetId(url);
    setConnectForm({
      ...connectForm,
      spreadsheet_id: spreadsheetId,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Google Sheets
                  </h1>
                  <p className="text-gray-600">
                    Connect and manage your Google Sheets for form data
                    collection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConnectModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Connect New Sheet
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Sheets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sheetsArray.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Connections
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sheetsArray.filter((s) => s.status === "active").length ||
                    sheetsArray.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Private Sheets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    sheetsArray.filter((s) => s.connection_type === "private")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search sheets by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Types</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <button
                onClick={() => dispatch(getUserSheets())}
                disabled={loading}
                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-green-500 mb-4" />
            <p className="text-gray-500">Loading sheets...</p>
          </div>
        )}

        {/* Sheets Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <FileSpreadsheet className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {sheet.spreadsheet_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          Sheet: {sheet.sheet_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        sheet.connection_type === "public"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {sheet.connection_type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Connected{" "}
                      {new Date(sheet.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-gray-500 font-mono truncate bg-gray-50 px-2 py-1 rounded">
                      ID: {sheet.spreadsheet_id}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${sheet.spreadsheet_id}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Google
                    </a>
                    <button
                      onClick={() => handleDisconnectSheet(sheet.id)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Disconnect sheet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSheets.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== "all"
                ? "No sheets found"
                : "No sheets connected"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria to find the sheets you're looking for."
                : "Connect your first Google Sheet to start collecting form data and managing your spreadsheets."}
            </p>
            {!searchTerm && filterType === "all" && (
              <button
                onClick={() => setShowConnectModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Connect Your First Sheet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Connect Sheet Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Google Sheet"
        size="md"
      >
        <form onSubmit={handleConnectSheet} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Sheets URL or Spreadsheet ID
            </label>
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/... or just the ID"
              value={connectForm.spreadsheet_id}
              onChange={handleUrlPaste}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-2">
              Paste the full URL or just the spreadsheet ID
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spreadsheet Name
            </label>
            <input
              type="text"
              placeholder="My Spreadsheet"
              value={connectForm.spreadsheet_name}
              onChange={(e) =>
                setConnectForm({
                  ...connectForm,
                  spreadsheet_name: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sheet Name
            </label>
            <input
              type="text"
              placeholder="Sheet1"
              value={connectForm.sheet_name}
              onChange={(e) =>
                setConnectForm({ ...connectForm, sheet_name: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Type
            </label>
            <select
              value={connectForm.connection_type}
              onChange={(e) =>
                setConnectForm({
                  ...connectForm,
                  connection_type: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowConnectModal(false)}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 font-medium"
            >
              {loading ? "Connecting..." : "Connect Sheet"}
            </button>
          </div>
        </form>
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

export default Sheets;
