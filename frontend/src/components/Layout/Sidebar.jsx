import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Users,
  Settings,
  Shield,
  X,
  Zap,
  BarChart3,
  Crown,
  Activity,
  ExternalLink,
  Code,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Google Sheets",
      href: "/sheets",
      icon: FileSpreadsheet,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Forms",
      href: "/forms",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "External APIs",
      href: "/external-apis",
      icon: ExternalLink,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "Embed Forms",
      href: "/embed-forms",
      icon: Code,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const adminNavItems = [
    {
      name: "Admin Dashboard",
      href: "/admin",
      icon: Crown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "Manage Users",
      href: "/admin/users",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "All Sheets",
      href: "/admin/sheets",
      icon: BarChart3,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      name: "All Forms",
      href: "/admin/forms",
      icon: Activity,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white shadow-sm border-r border-gray-200">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 px-6 py-6 bg-gradient-to-r from-teal-600 to-emerald-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">sheets</h1>
                  <p className="text-teal-100 text-xs">Data Management</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? `${item.bgColor} ${item.color} shadow-sm`
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={`mr-3 flex-shrink-0 w-5 h-5 ${
                              isActive
                                ? item.color
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                          <span className="font-medium">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>

              {user?.is_admin && (
                <div className="pt-6">
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Administration
                    </h3>
                    <div className="space-y-1">
                      {adminNavItems.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive
                                ? `${item.bgColor} ${item.color} shadow-sm`
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon
                                className={`mr-3 flex-shrink-0 w-5 h-5 ${
                                  isActive
                                    ? item.color
                                    : "text-gray-400 group-hover:text-gray-600"
                                }`}
                              />
                              <span className="font-medium">{item.name}</span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500">sheets v1.0</p>
                <p className="text-xs text-gray-400">
                  © 2025 All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-teal-600 to-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                <Zap className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">sheets</h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-white hover:bg-teal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}

            {user?.is_admin && (
              <>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin
                  </p>
                </div>
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? `${item.bgColor} ${item.color}`
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
