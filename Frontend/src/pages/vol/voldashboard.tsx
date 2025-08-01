import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowPathIcon, ExclamationTriangleIcon,DocumentTextIcon } from '@heroicons/react/24/outline';
import { appwriteService } from '../../services/appwrite';
import type { Disaster, DisasterStatus, UrgencyLevel } from '../../types/disaster';
import { WorldMap } from '../../components/private/WorldMap';

export const VolunteerDashboard = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisasters = async () => {
    setLoading(true);
    setError(null);
    try {
      const disasterData = await appwriteService.getAllDisasters();
      setDisasters(disasterData as unknown as Disaster[]);
    } catch (err) {
      setDisasters([]);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to fetch disasters: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const filteredDisasters = disasters.filter(disaster => disaster.status === 'active');

  const getStatusColor = (status: DisasterStatus): string => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Decorative background orbs for dark mode */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -z-10 transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-10 transition-colors duration-300" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Volunteer Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Monitor and manage disaster response operations</p>
            </div>
            <button
              onClick={fetchDisasters}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md transition-colors duration-300"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* World Map */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Global Disaster Map</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDisasters.length} active disasters tracked
            </div>
          </div>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-900/50 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
            </div>
          ) : (
            <WorldMap disasters={filteredDisasters} activeTab={"active"} />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6 shadow-sm transition-colors duration-300">
            <div className="flex">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 dark:text-red-300 mt-0.5 mr-3 transition-colors duration-300" />
              <div className="text-sm text-red-700 dark:text-red-300 transition-colors duration-300">{error}</div>
            </div>
          </div>
        )}

        {/* Disaster List */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 transition-colors duration-300"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 transition-colors duration-300"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            ) : filteredDisasters.length === 0 ? (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-700 mb-4 transition-colors duration-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">No active disasters found</h3>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">No disasters in the active category.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDisasters.map((disaster) => (
                  <div
                    key={disaster.$id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900/30 hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize transition-colors duration-300">
                            {disaster.emergency_type} Emergency
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUrgencyColor(disaster.urgency_level)} transition-colors duration-300`}>
                            {disaster.urgency_level?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed transition-colors duration-300">{disaster.situation}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          <span className={`px-3 py-1 rounded-full text-xs border font-medium ${getStatusColor(disaster.status)} transition-colors duration-300`}>
                            {disaster.status.toUpperCase()}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">
                            {new Date(disaster.submitted_time * 1000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <Link
                        to={`/vol/disaster/${disaster.$id}/`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transition-colors duration-300"
                      >
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        More Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};