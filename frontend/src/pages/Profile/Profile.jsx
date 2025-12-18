import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Bell,
  Globe,
  Lock,
  CheckCircle,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../store/slices/authSlice";
import { getUserSheets } from "../../store/slices/sheetsSlice";
import { getUserForms } from "../../store/slices/formsSlice";
import Toast from "../../components/UI/Toast";

// Account Activity Stats Component
const AccountActivityStats = () => {
  const { sheets } = useSelector((state) => state.sheets);
  const { forms } = useSelector((state) => state.forms);

  const sheetsArray = Array.isArray(sheets) ? sheets : [];
  const formsArray = Array.isArray(forms) ? forms : [];

  const activeFormsCount = formsArray.filter((form) => form.is_active).length;
  const totalSubmissions = formsArray.reduce(
    (total, form) => total + (form.submissions_count || 0),
    0
  );

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Account Activity
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Connected Sheets</span>
          <span className="font-semibold text-blue-600">
            {sheetsArray.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Active Forms</span>
          <span className="font-semibold text-purple-600">
            {activeFormsCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Submissions</span>
          <span className="font-semibold text-green-600">
            {totalSubmissions}
          </span>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    email_notifications_enabled: true,
    notify_form_submission: true,
    notify_sheet_connection: true,
    notify_form_status: true,
    notify_spam_detected: true,
    notify_api_limit: true,
    notify_system: true,
  });
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const fetchNotificationPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api.php?path=user/notification-preferences",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotificationPreferences(data);
      }
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
    }
  };

  useEffect(() => {
    // Fetch latest profile data
    dispatch(getUserProfile());
    // Fetch sheets and forms for activity stats
    dispatch(getUserSheets());
    dispatch(getUserForms());
    // Fetch notification preferences
    fetchNotificationPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setEditing(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setToast({
        message: "Failed to update profile: " + error,
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      avatar: user?.avatar || "",
    });
    setEditing(false);
  };

  const updateNotificationPreference = async (field, value) => {
    try {
      setLoadingPreferences(true);
      const token = localStorage.getItem("token");

      const updatedPreferences = {
        ...notificationPreferences,
        [field]: value,
      };

      const response = await fetch(
        "http://localhost:8000/api.php?path=user/notification-preferences",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPreferences),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotificationPreferences(data.preferences);
        setToast({
          message: "Notification preferences updated successfully!",
          type: "success",
        });
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      setToast({
        message: "Failed to update notification preferences",
        type: "error",
      });
    } finally {
      setLoadingPreferences(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setSendingTest(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api.php?path=user/test-email",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: `Test email sent to ${data.email}!`,
          type: "success",
        });
      } else {
        setToast({
          message: data.error || "Failed to send test email",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to send test email",
        type: "error",
      });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Profile Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage your account information and preferences
                  </p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {user?.avatar ? (
                    <img
                      className="w-24 h-24 rounded-full ring-4 ring-blue-500 ring-offset-4"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-blue-500 ring-offset-4">
                      <span className="text-white font-bold text-2xl">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  {editing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-gray-500 mb-4">{user?.email}</p>

                {user?.is_admin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-4">
                    <Shield className="w-4 h-4 mr-1" />
                    Administrator
                  </span>
                )}

                <div className="text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user?.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <AccountActivityStats />
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {editing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1 inline" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-1 inline" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">
                            {user?.name || "Not provided"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.email}</span>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {editing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={formData.avatar}
                        onChange={(e) =>
                          setFormData({ ...formData, avatar: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a URL for your profile picture
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* Master Email Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Master toggle for all email notifications
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            notificationPreferences.email_notifications_enabled
                          }
                          onChange={(e) =>
                            updateNotificationPreference(
                              "email_notifications_enabled",
                              e.target.checked
                            )
                          }
                          disabled={loadingPreferences}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Individual Notification Preferences */}
                    {notificationPreferences.email_notifications_enabled && (
                      <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                        {/* Form Submissions */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              📝 Form Submissions
                            </p>
                            <p className="text-xs text-gray-500">
                              Get notified when someone submits a form
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={
                              notificationPreferences.notify_form_submission
                            }
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_form_submission",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* Sheet Connection */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              🔗 Sheet Connection Updates
                            </p>
                            <p className="text-xs text-gray-500">
                              Alerts for connection issues or updates
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={
                              notificationPreferences.notify_sheet_connection
                            }
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_sheet_connection",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* Form Status */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              📋 Form Status Changes
                            </p>
                            <p className="text-xs text-gray-500">
                              When forms are activated or deactivated
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPreferences.notify_form_status}
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_form_status",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* Spam Detection */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              🚫 Spam Detection
                            </p>
                            <p className="text-xs text-gray-500">
                              Alerts when spam submissions are blocked
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={
                              notificationPreferences.notify_spam_detected
                            }
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_spam_detected",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* API Limit */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ⚠️ API Usage Warnings
                            </p>
                            <p className="text-xs text-gray-500">
                              When approaching your API quota limit
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPreferences.notify_api_limit}
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_api_limit",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* System Notifications */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              🔔 System Announcements
                            </p>
                            <p className="text-xs text-gray-500">
                              Important updates and announcements
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPreferences.notify_system}
                            onChange={(e) =>
                              updateNotificationPreference(
                                "notify_system",
                                e.target.checked
                              )
                            }
                            disabled={loadingPreferences}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* Test Email Button */}
                        <div className="pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={sendTestEmail}
                            disabled={sendingTest || loadingPreferences}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            {sendingTest ? "Sending..." : "Send Test Email"}
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-2">
                            We'll send a test email to {user?.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Profile;
