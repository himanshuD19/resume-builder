import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Eye, Users, TrendingUp, Calendar, Palette, Camera, FileText, RefreshCw, X } from 'lucide-react';
import { getAnalytics, getAnalyticsByPeriod, resetAnalytics } from '../utils/analytics';

const AdminPanel = ({ onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState(7); // days
  const [periodData, setPeriodData] = useState(null);

  const loadAnalytics = () => {
    const data = getAnalytics();
    setAnalytics(data);
    
    const periodStats = getAnalyticsByPeriod(period);
    setPeriodData(periodStats);
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all analytics data? This cannot be undone.')) {
      resetAnalytics();
      loadAnalytics();
    }
  };

  if (!analytics) return null;

  const totalResumes = analytics.totalDownloads + analytics.totalPreviews;
  const downloadRate = totalResumes > 0 ? ((analytics.totalDownloads / totalResumes) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Admin Analytics Dashboard</h2>
              <p className="text-indigo-100 text-sm">Resume Builder Performance Metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Downloads */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-500 rounded-lg p-2">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-green-700">{analytics.totalDownloads}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Total Downloads</h3>
              <p className="text-xs text-gray-500 mt-1">All-time resume downloads</p>
            </div>

            {/* Total Previews */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-500 rounded-lg p-2">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-blue-700">{analytics.totalPreviews}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Total Previews</h3>
              <p className="text-xs text-gray-500 mt-1">All-time resume previews</p>
            </div>

            {/* Total Users */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-500 rounded-lg p-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-purple-700">{totalResumes}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Total Interactions</h3>
              <p className="text-xs text-gray-500 mt-1">Downloads + Previews</p>
            </div>

            {/* Download Rate */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-orange-500 rounded-lg p-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-orange-700">{downloadRate}%</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Download Rate</h3>
              <p className="text-xs text-gray-500 mt-1">Downloads vs total actions</p>
            </div>
          </div>

          {/* Period Filter */}
          <div className="mb-6 flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Time Period:</span>
            <div className="flex gap-2">
              {[7, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => setPeriod(days)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    period === days
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Last {days} days
                </button>
              ))}
            </div>
            {periodData && (
              <div className="ml-auto text-sm text-gray-600">
                <span className="font-semibold">{periodData.downloads}</span> downloads, 
                <span className="font-semibold ml-1">{periodData.previews}</span> previews
              </div>
            )}
          </div>

          {/* Resume Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Resume Types Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">With Photo</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {analytics.resumeTypes.withPhoto}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          (analytics.resumeTypes.withPhoto /
                            (analytics.resumeTypes.withPhoto + analytics.resumeTypes.withoutPhoto || 1)) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Without Photo</span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {analytics.resumeTypes.withoutPhoto}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          (analytics.resumeTypes.withoutPhoto /
                            (analytics.resumeTypes.withPhoto + analytics.resumeTypes.withoutPhoto || 1)) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Themes */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                Popular Color Themes
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.colorThemes)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([theme, count]) => (
                    <div key={theme} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{
                            backgroundColor:
                              theme === 'blue' ? '#1e40af' :
                              theme === 'indigo' ? '#4338ca' :
                              theme === 'purple' ? '#7c3aed' :
                              theme === 'green' ? '#059669' :
                              theme === 'teal' ? '#0d9488' :
                              theme === 'red' ? '#dc2626' :
                              theme === 'orange' ? '#ea580c' :
                              theme === 'pink' ? '#db2777' :
                              theme === 'slate' ? '#475569' :
                              theme === 'gray' ? '#4b5563' :
                              theme === 'cyan' ? '#0891b2' :
                              '#1e3a8a'
                          }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{theme}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
