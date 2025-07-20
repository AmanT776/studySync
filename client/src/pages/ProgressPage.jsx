import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useUser } from '../UserContext';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

const EnhancedStats = ({ stats = {} }) => {
  const quizzes = stats.quizzesAnswered || 0;
  const correct = stats.correctAnswers || 0;
  const incorrect = stats.incorrectAnswers || 0;
  const accuracy = quizzes > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
  if (quizzes === 0 && correct === 0 && incorrect === 0) {
    return <div className="text-gray-400">No quiz stats yet.</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="flex items-center gap-1">
        <span role="img" aria-label="quiz" className="text-blue-500">❓</span>
        <span>Quizzes:</span> <span className="font-semibold">{quizzes}</span>
      </div>
      <div className="flex items-center gap-1">
        <span role="img" aria-label="correct" className="text-green-600">✅</span>
        <span>Correct:</span> <span className="font-semibold text-green-700">{correct}</span>
      </div>
      <div className="flex items-center gap-1">
        <span role="img" aria-label="incorrect" className="text-red-600">❌</span>
        <span>Incorrect:</span> <span className="font-semibold text-red-700">{incorrect}</span>
      </div>
      <div className="flex items-center gap-1">
        <span role="img" aria-label="accuracy" className="text-purple-600">📊</span>
        <span>Accuracy:</span> <span className="font-semibold text-purple-700">{accuracy}%</span>
      </div>
    </div>
  );
};

const QuizResultsTable = ({ quizResults }) => {
  if (!quizResults || quizResults.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="font-semibold mb-1">Quiz Marks History:</div>
      <table className="min-w-full text-sm border bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 text-left">Date</th>
            <th className="px-2 py-1 text-left">Score</th>
            <th className="px-2 py-1 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((qr, i) => (
            <tr key={i} className="border-t">
              <td className="px-2 py-1">{formatDate(qr.date)}</td>
              <td className="px-2 py-1 font-semibold text-blue-700">{qr.score}</td>
              <td className="px-2 py-1">{qr.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProgressPage = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
useEffect(() => {
    if (!user?.id) return;

    console.log("Fetching progress for user ID:", user.id);

    const fetchData = async () => {
      try {
        const response = await api.get(`/progress/user/${user.id}`);
        setProgress(response.data);
        console.log("Fetched progress:", response.data);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err?.response?.data?.message || 'Failed to load progress');
      }
    };

    fetchData();
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
                  <div key={idx} className="border rounded p-4 bg-gray-50">
                    <div className="font-semibold mb-1 text-lg">
                      <span className="text-blue-700">Room ID: {p.room}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span role="img" aria-label="streak" className="text-orange-500">🔥</span>
                      <span>Streak: <span className="font-bold">{p.streak} days</span></span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span role="img" aria-label="last activity" className="text-gray-500">🕒</span>
                      <span>Last Activity: <span className="text-gray-700">{formatDate(p.lastActivity)}</span></span>
                    </div>
                    <div className="mt-2 font-semibold">Quiz Stats:</div>
                    <EnhancedStats stats={p.stats} />
                    <QuizResultsTable quizResults={p.quizResults} />
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
