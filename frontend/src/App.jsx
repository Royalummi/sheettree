import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Components
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "./components/Auth/AdminRoute";
import TokenExpiryModal from "./components/Auth/TokenExpiryModal";

// Pages
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Auth/Login";
import AuthCallback from "./pages/Auth/AuthCallback";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sheets from "./pages/Sheets/Sheets";
import ConnectSheet from "./pages/Sheets/ConnectSheet";
import Forms from "./pages/Forms/Forms";
import CreateForm from "./pages/Forms/CreateForm";
import EditForm from "./pages/Forms/EditForm";
import PublicForm from "./pages/Forms/PublicForm";
import ExternalApis from "./pages/ExternalApis/ExternalApis";
import EmbedForms from "./pages/EmbedForms/EmbedForms";
import Profile from "./pages/Profile/Profile";
import Notifications from "./pages/Notifications/Notifications";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSheets from "./pages/Admin/AdminSheets";
import AdminForms from "./pages/Admin/AdminForms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";
import NotFound from "./pages/NotFound";

// Store
import { loginSuccess, logout } from "./store/slices/authSlice";

// Utils
import tokenManager from "./utils/tokenManager";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(0);

  useEffect(() => {
    // Check for token in URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Extract user info from token (simplified - in production, decode JWT)
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      dispatch(loginSuccess({ token, user }));

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Successfully logged in!");
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // Start token monitoring
      tokenManager.startMonitoring(
        (minutesLeft) => {
          // Token expiring callback
          setMinutesRemaining(minutesLeft);
          setShowExpiryModal(true);
        },
        () => {
          // Token expired callback
          toast.error("Your session has expired. Please log in again.");
          dispatch(logout());
        }
      );
    } else {
      // Stop monitoring when not authenticated
      tokenManager.stopMonitoring();
    }

    return () => {
      tokenManager.stopMonitoring();
    };
  }, [isAuthenticated, dispatch]);

  const handleTokenRefresh = () => {
    tokenManager.resetWarning();
    toast.success("Session refreshed successfully!");
  };

  const handleLogout = () => {
    tokenManager.stopMonitoring();
    toast.info("You have been logged out.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Form Submission Route (Public) */}
        <Route path="/form/:id" element={<PublicForm />} />

        {/* Private Routes with Layout wrapper */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Sheets Routes */}
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/sheets/connect" element={<ConnectSheet />} />

          {/* Forms Routes */}
          <Route path="/forms" element={<Forms />} />
          <Route path="/forms/create" element={<CreateForm />} />
          <Route path="/forms/:id/edit" element={<EditForm />} />

          {/* External APIs Routes */}
          <Route path="/external-apis" element={<ExternalApis />} />

          {/* Embed Forms Routes */}
          <Route path="/embed-forms" element={<EmbedForms />} />
        </Route>

        {/* Admin Routes with Layout wrapper */}
        <Route
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/sheets" element={<AdminSheets />} />
          <Route path="/admin/forms" element={<AdminForms />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Token Expiry Modal */}
      <TokenExpiryModal
        isOpen={showExpiryModal}
        onClose={() => setShowExpiryModal(false)}
        minutesRemaining={minutesRemaining}
        onRefresh={handleTokenRefresh}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
