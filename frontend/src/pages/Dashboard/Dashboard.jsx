import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Plus,
  FileSpreadsheet,
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Activity,
  Zap,
  BarChart3,
  Eye,
  Edit3,
  ExternalLink,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { getUserSheets } from "../../store/slices/sheetsSlice";
import { getUserForms } from "../../store/slices/formsSlice";
import { getUserProfile } from "../../store/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sheets } = useSelector((state) => state.sheets);
  const { forms } = useSelector((state) => state.forms);

  // Ensure forms and sheets are arrays
  const formsArray = Array.isArray(forms) ? forms : [];
  const sheetsArray = Array.isArray(sheets) ? sheets : [];

  useEffect(() => {
    dispatch(getUserSheets());
    dispatch(getUserForms());

    // Fetch user profile if we don't have complete user data
    if (!user?.name || user?.name === "User Name") {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const stats = [
    {
      name: "Connected Sheets",
      value: sheetsArray.length,
      icon: FileSpreadsheet,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Active Forms",
      value: formsArray.filter((form) => form.is_active).length,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Forms",
      value: formsArray.length,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Total Submissions",
      value: formsArray.reduce(
        (total, form) => total + (form.submissions_count || 0),
        0
      ),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      change: "+24%",
      changeType: "positive",
    },
  ];

  const quickActions = [
    {
      title: "Connect Google Sheet",
      description: "Link a new Google Sheet to start collecting data",
      icon: FileSpreadsheet,
      link: "/sheets",
      color: "blue",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Create New Form",
      description: "Design a custom form for data collection",
      icon: FileText,
      link: "/forms",
      color: "emerald",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {user?.avatar ? (
                  <img
                    className="h-12 w-12 rounded-full ring-2 ring-blue-500 ring-offset-2"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || "Loading..."}! 👋
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/forms/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`relative overflow-hidden rounded-xl ${stat.bgColor} p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-white/20`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`${stat.iconBg} rounded-lg p-3 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <span className="text-sm text-gray-500">
                    Get started fast
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className={`group ${action.bgColor} rounded-lg p-4 transition-all duration-200 hover:shadow-md border border-gray-100 hover:border-gray-200`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg bg-white shadow-sm`}
                        >
                          <action.icon
                            className={`h-5 w-5 ${action.iconColor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                            {action.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Forms */}
          <div className="space-y-6">
            {/* Recent Forms */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Recent Forms
                  </h3>
                  <Link
                    to="/forms"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {formsArray.length > 0 ? (
                    formsArray.slice(0, 3).map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`p-2 rounded-lg ${
                              form.is_active ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            <FileText
                              className={`h-4 w-4 ${
                                form.is_active
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {form.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                form.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {form.is_active ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {form.submissions_count || 0} submissions
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/forms/${form.id}/edit`}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/form/${form.id}`}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 mb-4">
                        No forms created yet
                      </p>
                      <Link
                        to="/forms/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first form
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
