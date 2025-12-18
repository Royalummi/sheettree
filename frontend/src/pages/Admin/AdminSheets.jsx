import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FileSpreadsheet,
  Search,
  ExternalLink,
  Calendar,
  User,
  RefreshCw,
  Filter,
} from "lucide-react";

const AdminSheets = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, manual, picker

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/sheets");
      setSheets(response.data.sheets || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch sheets");
      console.error("Error fetching sheets:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSheets = sheets.filter((sheet) => {
    const matchesSearch =
      sheet.spreadsheet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.sheet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || sheet.connection_type === filterType;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            All Connected Sheets
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of all connected sheets across users
          </p>
        </div>
        <button
          onClick={fetchSheets}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Sheets</p>
          <p className="text-2xl font-bold text-gray-900">{sheets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Manual Connections</p>
          <p className="text-2xl font-bold text-gray-900">
            {sheets.filter((s) => s.connection_type === "manual").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Picker Connections</p>
          <p className="text-2xl font-bold text-gray-900">
            {sheets.filter((s) => s.connection_type === "picker").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Unique Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(sheets.map((s) => s.user_id)).size}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sheets by name or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="manual">Manual</option>
              <option value="picker">Picker</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Sheets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spreadsheet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connected
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {searchTerm || filterType !== "all"
                        ? "No sheets found matching your criteria"
                        : "No sheets found"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSheets.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FileSpreadsheet className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {sheet.spreadsheet_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sheet.sheet_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            ID: {sheet.spreadsheet_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {sheet.user_name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {sheet.user_email || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sheet.connection_type === "picker"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {sheet.connection_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(sheet.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${sheet.spreadsheet_id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                      >
                        Open
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || filterType !== "all") && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredSheets.length} of {sheets.length} sheets
        </div>
      )}
    </div>
  );
};

export default AdminSheets;
