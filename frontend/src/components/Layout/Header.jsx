import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import {
  Menu,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Crown,
  Zap,
} from "lucide-react";

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Dashboard";
    if (path === "/sheets") return "Google Sheets";
    if (path === "/forms") return "Forms";
    if (path === "/profile") return "Profile";
    if (path === "/admin") return "Admin Dashboard";
    if (path === "/admin/users") return "Manage Users";
    if (path === "/admin/sheets") return "All Sheets";
    if (path === "/admin/forms") return "All Forms";

    // For dynamic routes or unknown paths
    if (path.startsWith("/admin")) return "Admin Panel";
    if (path.startsWith("/sheets/")) return "Sheet Details";
    if (path.startsWith("/forms/")) return "Form Details";

    // Default fallback
    return "sheets";
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo for mobile */}
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">sheets</span>
          </div>

          {/* Page title for desktop */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user?.avatar ? (
                <img
                  className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      {user?.is_admin && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Profile Settings
                  </button>

                  {user?.is_admin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Crown className="w-4 h-4 mr-3 text-gray-400" />
                      Admin Panel
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-400" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
