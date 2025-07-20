import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StudyRoomPage from './pages/StudyRoomPage';
import QuizPage from './pages/QuizPage';
import { useUser } from './UserContext';

function PrivateRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><StudyRoomPage /></PrivateRoute>} />
          <Route path="/room/:roomId/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}
