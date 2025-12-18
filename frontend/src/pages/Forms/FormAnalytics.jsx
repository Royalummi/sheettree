import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FormAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d, all

  useEffect(() => {
    fetchAnalytics();
  }, [id, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockData = {
        totalSubmissions: 1247,
        avgResponseTime: 245, // seconds
        completionRate: 87.3, // percentage
        uniqueVisitors: 892,
        conversionRate: 34.2,
        submissionsOverTime: [
          { date: "2025-12-11", count: 45 },
          { date: "2025-12-12", count: 52 },
          { date: "2025-12-13", count: 38 },
          { date: "2025-12-14", count: 67 },
          { date: "2025-12-15", count: 71 },
          { date: "2025-12-16", count: 89 },
          { date: "2025-12-17", count: 94 },
          { date: "2025-12-18", count: 102 },
        ],
        fieldCompletionRates: [
          { field: "Name", rate: 98 },
          { field: "Email", rate: 96 },
          { field: "Phone", rate: 82 },
          { field: "Message", rate: 75 },
          { field: "Company", rate: 68 },
        ],
        deviceBreakdown: [
          { device: "Desktop", count: 687, percentage: 55 },
          { device: "Mobile", count: 435, percentage: 35 },
          { device: "Tablet", count: 125, percentage: 10 },
        ],
        locationData: [
          { country: "United States", count: 542 },
          { country: "United Kingdom", count: 234 },
          { country: "Canada", count: 178 },
          { country: "Australia", count: 145 },
          { country: "Germany", count: 98 },
        ],
        hourlyDistribution: [
          { hour: "00:00", count: 12 },
          { hour: "02:00", count: 8 },
          { hour: "04:00", count: 5 },
          { hour: "06:00", count: 15 },
          { hour: "08:00", count: 45 },
          { hour: "10:00", count: 78 },
          { hour: "12:00", count: 92 },
          { hour: "14:00", count: 85 },
          { hour: "16:00", count: 67 },
          { hour: "18:00", count: 54 },
          { hour: "20:00", count: 38 },
          { hour: "22:00", count: 25 },
        ],
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const submissionsChart = {
    labels: analytics?.submissionsOverTime.map((d) => d.date) || [],
    datasets: [
      {
        label: "Submissions",
        data: analytics?.submissionsOverTime.map((d) => d.count) || [],
        fill: true,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const deviceChart = {
    labels: analytics?.deviceBreakdown.map((d) => d.device) || [],
    datasets: [
      {
        data: analytics?.deviceBreakdown.map((d) => d.count) || [],
        backgroundColor: ["#8B5CF6", "#EC4899", "#10B981"],
        borderWidth: 0,
      },
    ],
  };

  const hourlyChart = {
    labels: analytics?.hourlyDistribution.map((d) => d.hour) || [],
    datasets: [
      {
        label: "Submissions",
        data: analytics?.hourlyDistribution.map((d) => d.count) || [],
        backgroundColor: "rgba(139, 92, 246, 0.8)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Form Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track performance and insights for your form
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +12.5%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Submissions
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.totalSubmissions.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +8.3%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Unique Visitors
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.uniqueVisitors.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +5.2%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Conversion Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.conversionRate}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                -2.1%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Avg. Response Time
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.floor(analytics.avgResponseTime / 60)}m{" "}
              {analytics.avgResponseTime % 60}s
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submissions Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Submissions Over Time
            </h3>
            <Line
              data={submissionsChart}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Device Breakdown
            </h3>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={deviceChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Submissions by Hour
          </h3>
          <Bar
            data={hourlyChart}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* Field Completion Rates & Top Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field Completion */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Field Completion Rates
            </h3>
            <div className="space-y-4">
              {analytics.fieldCompletionRates.map((field) => (
                <div key={field.field}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.field}
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {field.rate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${field.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Locations
            </h3>
            <div className="space-y-3">
              {analytics.locationData.map((location, index) => (
                <div
                  key={location.country}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {location.country}
                    </span>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {location.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAnalytics;
