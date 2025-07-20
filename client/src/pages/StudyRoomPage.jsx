import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import socket from '../socket';
import { useUser } from '../UserContext';

const FlashcardSection = ({  flashcards, setFlashcards }) => {
  const { user } = useUser();
  const roomId = useParams().roomId;
  const [newFlashcard, setNewFlashcard] = useState({ question: '',roomId, answer: '' });
  console.log(newFlashcard)
  const handleAddFlashcard = async (e) => {
    e.preventDefault();
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim() || !user) return;
    try {
      console.log(newFlashcard);
      const res = await api.post('/flashcards/', {
        question: newFlashcard.question,
        answer: newFlashcard.answer,
        room: roomId,
        createdBy: user.id,
      });
      setFlashcards((prev) => [...prev, res.data]);
      socket.emit('flashcardUpdate', { roomId, flashcard: res.data });
      setNewFlashcard({ question: '', answer: '' });
    } catch(err){
      alert('Failed to add flashcard');
      console.error('post error',err);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
      <form onSubmit={handleAddFlashcard} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Question"
          value={newFlashcard.question}
          onChange={e => setNewFlashcard(f => ({ ...f, question: e.target.value }))}
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Answer"
          value={newFlashcard.answer}
          onChange={e => setNewFlashcard(f => ({ ...f, answer: e.target.value }))}
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(flashcards) && flashcards.map(card => (
          <div key={card._id} className="border rounded p-4 bg-gray-50">
            <div className="font-semibold">Q: {card.question}</div>
            <div className="mt-1 text-gray-700">A: {card.answer}</div>
          </div>
        ))}
        {Array.isArray(flashcards) && flashcards.length === 0 && <div className="text-gray-400">No flashcards yet.</div>}
      </div>
    </div>
  );
};

const StudyRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await api.get(`/flashcards/${roomId}`);
        setFlashcards(res.data);
      } catch (err) {
        console.error('Failed to fetch flashcards', err);
      }
    };
    if (roomId) fetchFlashcards();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    if (!socket.connected) socket.connect();
    socket.emit('joinRoom', { roomId });

    const handleFlashcardUpdate = (flashcard) => {
      setFlashcards(prev => {
        // Avoid duplicates
        if (prev.some(f => f._id === flashcard._id)) return prev;
        return [...prev, flashcard];
      });
    };
    socket.on('flashcardUpdate', handleFlashcardUpdate);

    return () => {
      socket.off('flashcardUpdate', handleFlashcardUpdate);
      // Optionally: socket.emit('leaveRoom', { roomId });
    };
  }, [roomId]);

  return (
    <div>
      <button
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        onClick={() => navigate('/dashboard')}
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Study Room</h1>
      <button
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => window.location.href = `/room/${roomId}`}
      >
        Take Quiz
      </button>
      <FlashcardSection roomId={roomId} flashcards={flashcards} setFlashcards={setFlashcards} />
    </div>
  );
};

export default StudyRoomPage;
