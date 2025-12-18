import React from "react";
import { Monitor, Tablet, Smartphone, Maximize2 } from "lucide-react";

const EmbedPreview = ({
  url,
  title,
  width = "100%",
  height = "600px",
  device = "desktop",
  onDeviceChange,
  onFullScreen,
}) => {
  const getDeviceConfig = (deviceType) => {
    switch (deviceType) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
          maxWidth: "375px",
          label: "Mobile",
        };
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
          maxWidth: "768px",
          label: "Tablet",
        };
      default:
        return {
          width: "100%",
          height: height,
          maxWidth: "100%",
          label: "Desktop",
        };
    }
  };

  const deviceConfig = getDeviceConfig(device);
  const devices = [
    { key: "desktop", icon: Monitor, label: "Desktop" },
    { key: "tablet", icon: Tablet, label: "Tablet" },
    { key: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  return (
    <div className="space-y-4">
      {/* Device Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {devices.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => onDeviceChange && onDeviceChange(key)}
              className={`flex items-center px-3 py-2 rounded-lg border text-sm ${
                device === key
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
              }`}
              title={label}
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {onFullScreen && (
          <button
            onClick={onFullScreen}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Full Screen Preview"
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>
        )}
      </div>

      {/* Preview Frame */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="mx-auto" style={{ maxWidth: deviceConfig.maxWidth }}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Device Frame Header (for mobile/tablet) */}
            {device !== "desktop" && (
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-center">
                <div className="text-white text-xs font-medium">
                  {deviceConfig.label} Preview ({deviceConfig.width})
                </div>
              </div>
            )}

            {/* Iframe */}
            <iframe
              src={url}
              width={deviceConfig.width}
              height={deviceConfig.height}
              frameBorder="0"
              scrolling="auto"
              className="w-full bg-white"
              title={`${deviceConfig.label} preview of ${title}`}
              style={{
                minHeight: device === "desktop" ? height : deviceConfig.height,
              }}
            />
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-center text-sm text-gray-500">
        Preview showing {deviceConfig.label.toLowerCase()} view
        {device !== "desktop" &&
          ` (${deviceConfig.width} × ${deviceConfig.height})`}
      </div>
    </div>
  );
};

export default EmbedPreview;
