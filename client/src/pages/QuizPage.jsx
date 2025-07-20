import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../UserContext';

const shuffleArray = (array) => {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const QuizPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizOrder, setQuizOrder] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await api.get(`/flashcards/${roomId}`);
        setFlashcards(res.data);
        setQuizOrder(shuffleArray(res.data.map((_, idx) => idx)));
      } catch (err) {
        alert('Failed to load flashcards for quiz');
      }
    };
    if (roomId) fetchFlashcards();
  }, [roomId]);

  // Function to post quiz result to progress model
  const postQuizResult = async () => {
    if (!user || !user.id || !roomId) return;
    const payload = {
      user: user.id,
      room: roomId,
      score: score,
      total: quizOrder.length,
      // quizId: ... // Optionally add quizId if you have it
    };
    try {
      console.log('Posting quiz result to progress:', payload);
      await api.post('/progress', payload);
    } catch (err) {
      console.error('Failed to post quiz result to progress', err);
    }
  };

  useEffect(() => {
    if (showScore) {
      postQuizResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScore]);

  if (!flashcards.length) {
    return <div className="p-8">No flashcards available for quiz.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const idx = quizOrder[current];
    if (userAnswer.trim().toLowerCase() === flashcards[idx].answer.trim().toLowerCase()) {
      setScore(score + 1);
    }
    if (current + 1 < quizOrder.length) {
      setCurrent(current + 1);
      setUserAnswer('');
    } else {
      setShowScore(true);
    }
  };

  if (showScore) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="mb-4">Your score: <span className="font-semibold">{score} / {quizOrder.length}</span></p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>Back to Room</button>
      </div>
    );
  }

  const idx = quizOrder[current];
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-xl font-semibold mb-4">Quiz ({current + 1} / {quizOrder.length})</h2>
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <span className="font-semibold">Q:</span> {flashcards[idx].question}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Type your answer..."
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          autoFocus
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default QuizPage; 