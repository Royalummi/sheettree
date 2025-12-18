import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiateGoogleAuth } from "../../store/slices/authSlice";
import { APP_NAME } from "../../config/constants";
import { FileSpreadsheet, BarChart3, Users, Zap } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleGoogleLogin = () => {
    dispatch(initiateGoogleAuth());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>

        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileSpreadsheet className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">{APP_NAME}</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Transform Your
              <br />
              <span className="text-teal-200">Google Sheets</span>
              <br />
              Into Powerful Forms
            </h2>
            <p className="text-xl text-teal-100 mb-12 leading-relaxed">
              Create beautiful forms, collect data seamlessly, and sync
              everything directly to your Google Sheets in real-time.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Real-time data synchronization</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Beautiful, responsive forms</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Quick setup in minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="p-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl">
              <FileSpreadsheet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group relative w-full flex items-center justify-center py-4 px-6 border-2 border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  "Continue with Google"
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 leading-relaxed">
                By continuing, you agree to connect your Google account and
                allow access to your Google Sheets for seamless form
                integration.
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-2xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-2xl font-bold text-gray-900">10k+</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-2xl font-bold text-gray-900">5★</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
