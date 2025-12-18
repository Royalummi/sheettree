import React, { useState, useEffect } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const EmbedCodeDisplay = ({
  code,
  url,
  onCopyCode,
  onCopyUrl,
  title = "Embed Code",
  showUrl = true,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      onCopyCode && onCopyCode();
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      onCopyUrl && onCopyUrl();
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="flex items-center space-x-2">
          {showUrl && url && (
            <button
              onClick={handleCopyUrl}
              className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {copiedUrl ? (
                <Check className="w-4 h-4 mr-1 text-green-600" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-1" />
              )}
              {copiedUrl ? "URL Copied!" : "Copy URL"}
            </button>
          )}
          <button
            onClick={handleCopyCode}
            className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            {copiedCode ? (
              <Check className="w-4 h-4 mr-1" />
            ) : (
              <Copy className="w-4 h-4 mr-1" />
            )}
            {copiedCode ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>

      {/* URL Display */}
      {showUrl && url && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Direct Embed URL:
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-xs bg-white px-2 py-1 rounded border truncate">
              {url}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedCodeDisplay;
