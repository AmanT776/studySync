import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useUser } from '../UserContext';

const ProgressPage = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.get(`/progress/user/${user.id}`);
        setProgress(res.data);
      } catch (err) {
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
          <p className="mt-1 text-sm text-gray-500">Track your study habits and achievements</p>
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : progress.length === 0 ? (
              <div className="text-gray-500">No progress data yet.</div>
            ) : (
              <div className="space-y-4">
                {progress.map((p, idx) => (
                  <div key={idx} className="border rounded p-4">
                    <div className="font-semibold">Room: {p.room}</div>
                    <div>Streak: <span className="text-orange-500 font-bold">{p.streak} days</span></div>
                    <div>Stats:
                      <pre className="bg-gray-100 rounded p-2 mt-1 text-xs">
                        {JSON.stringify(p.stats, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
