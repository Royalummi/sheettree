import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Clock, RefreshCw, LogOut } from "lucide-react";
import { refreshToken, logout } from "../../store/slices/authSlice";

const TokenExpiryModal = ({
  isOpen,
  minutesRemaining,
  onClose,
  onRefresh,
  onLogout,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(minutesRemaining * 60);

  useEffect(() => {
    if (isOpen && minutesRemaining) {
      setCountdown(minutesRemaining * 60);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isOpen, minutesRemaining]);

  const handleStayLoggedIn = async () => {
    setLoading(true);
    try {
      await dispatch(refreshToken()).unwrap();
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    onLogout();
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-gray-600">
              Your session will expire in {formatTime(countdown)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Your session is about to expire for security reasons. Would you like
            to stay logged in or log out?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStayLoggedIn}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Stay Logged In
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Session will automatically expire if no action is taken
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryModal;
