// FlashcardSection.js
import React, { useState } from 'react';
import api from '../api';
import socket from '../socket';
import { useUser } from '../UserContext';

const FlashcardSection = ({ roomId, flashcards, setFlashcards }) => {
  const { user } = useUser();
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });

  const handleAddFlashcard = async (e) => {
    e.preventDefault();
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim() || !user) return;
    try {
      console.log({
        question: newFlashcard.question,
        answer: newFlashcard.answer,
        room: roomId,
        createdBy: user.id,
      });
      const res = await api.post('/flashcards', {
        question: newFlashcard.question,
        answer: newFlashcard.answer,
        room: roomId,
        createdBy: user.id,
      });
      setFlashcards((prev) => [...prev, res.data]);
      socket.emit('flashcardUpdate', { roomId, flashcard: res.data });
      setNewFlashcard({ question: '', answer: '' });
    } catch {
      alert('Failed to add flashcard');
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

export default FlashcardSection;
