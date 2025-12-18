import React from "react";
import {
  FileText,
  Inbox,
  Search,
  PlusCircle,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

/**
 * Enhanced Empty State Components
 * Provide helpful guidance when no data exists
 */

export const EmptyForms = ({ onCreateForm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-full p-6 mb-6">
        <FileText className="w-16 h-16 text-purple-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No forms yet</h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Create your first form to start collecting data into Google Sheets.
        Choose from templates or build from scratch.
      </p>
      <button
        onClick={onCreateForm}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Create Your First Form
      </button>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="bg-purple-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📝</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Easy Builder</h4>
          <p className="text-sm text-gray-600">
            Drag and drop fields to create forms in minutes
          </p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Google Sheets</h4>
          <p className="text-sm text-gray-600">
            Data syncs automatically to your spreadsheets
          </p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Instant Deploy</h4>
          <p className="text-sm text-gray-600">
            Share, embed, or use via API immediately
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmptySubmissions = ({ formName }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full p-6 mb-6">
        <Inbox className="w-16 h-16 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No submissions yet
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Your form "{formName}" hasn't received any submissions yet. Share your
        form to start collecting responses.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:shadow-md transition-all">
          <Search className="w-5 h-5 mr-2" />
          Preview Form
        </button>
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
          Share Form
        </button>
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-6 max-w-2xl">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
          Ways to share your form:
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>
              Copy the public link and share via email or social media
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Embed the form on your website using the iframe code</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Integrate with your app using the REST API</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const EmptySheets = ({ onConnectSheet }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-full p-6 mb-6">
        <Database className="w-16 h-16 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No sheets connected
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Connect your Google Sheets to automatically sync form submissions. You
        can connect existing sheets or create new ones.
      </p>
      <button
        onClick={onConnectSheet}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Connect Google Sheet
      </button>

      <div className="mt-12 bg-green-50 rounded-xl p-6 max-w-2xl">
        <h4 className="font-semibold text-gray-900 mb-3">How it works:</h4>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
              1
            </span>
            <span>Authorize SheetTree to access your Google Sheets</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
              2
            </span>
            <span>Select an existing spreadsheet or create a new one</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
              3
            </span>
            <span>Connect it to your form and start collecting data</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export const EmptySearch = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-6 mb-6">
        <Search className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-4">
        We couldn't find anything matching <strong>"{searchTerm}"</strong>
      </p>
      <p className="text-sm text-gray-500 text-center max-w-md">
        Try adjusting your search terms or filters
      </p>
    </div>
  );
};

export const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full p-6 mb-6">
        <AlertCircle className="w-16 h-16 text-yellow-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No notifications
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        You're all caught up! We'll notify you about form submissions, system
        updates, and important events.
      </p>
    </div>
  );
};

export const ErrorState = ({ title, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-full p-6 mb-6">
        <XCircle className="w-16 h-16 text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title || "Something went wrong"}
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        {message ||
          "We encountered an error while loading this content. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-full p-6 mb-6 animate-pulse">
        <Clock className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600 text-center max-w-md">
        Please wait while we fetch your data...
      </p>
    </div>
  );
};

export default {
  EmptyForms,
  EmptySubmissions,
  EmptySheets,
  EmptySearch,
  EmptyNotifications,
  ErrorState,
  LoadingState,
};
