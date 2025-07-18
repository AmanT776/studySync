const Progress = require('./models/Progress');
const Quiz = require('./models/Quiz');

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

async function updateStreak(userId, roomId) {
  const progress = await Progress.findOne({ user: userId, room: roomId });
  const now = new Date();
  if (!progress) {
    await Progress.findOneAndUpdate(
      { user: userId, room: roomId },
      { $set: { lastActivity: now }, $inc: { streak: 1 } },
      { upsert: true, new: true }
    );
    return;
  }
  if (!progress.lastActivity) {
    progress.streak = 1;
    progress.lastActivity = now;
    await progress.save();
    return;
  }
  const last = new Date(progress.lastActivity);
  // If last activity was yesterday, increment streak
  const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (isSameDay(now, last)) {
    // Already active today, do nothing
    return;
  } else if (diff === 1) {
    progress.streak += 1;
    progress.lastActivity = now;
    await progress.save();
  } else if (diff > 1) {
    // Missed a day, reset streak
    progress.streak = 1;
    progress.lastActivity = now;
    await progress.save();
  }
}

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a study room
    socket.on('joinRoom', ({ roomId, userId }) => {
      socket.join(roomId);
      io.to(roomId).emit('userJoined', { userId, socketId: socket.id });
    });

    // Real-time chat
    socket.on('chatMessage', ({ roomId, message }) => {
      io.to(roomId).emit('chatMessage', message);
    });

    // Real-time flashcard updates
    socket.on('flashcardUpdate', async ({ roomId, flashcard }) => {
      io.to(roomId).emit('flashcardUpdate', flashcard);
      if (flashcard.createdBy && roomId) {
        await Progress.findOneAndUpdate(
          { user: flashcard.createdBy, room: roomId },
          { $inc: { 'stats.flashcardsAdded': 1 } },
          { upsert: true, new: true }
        );
        await updateStreak(flashcard.createdBy, roomId);
      }
    });

    // Real-time quiz answers
    socket.on('quizAnswer', async ({ roomId, answer }) => {
      io.to(roomId).emit('quizAnswer', answer);
      if (answer.userId && roomId && answer.quizId !== undefined && answer.answer !== undefined) {
        // Find the quiz and check if the answer is correct
        const quiz = await Quiz.findById(answer.quizId);
        let isCorrect = false;
        if (quiz && quiz.questions && quiz.questions[0]) {
          isCorrect = quiz.questions[0].correctAnswer === answer.answer;
        }
        await Progress.findOneAndUpdate(
          { user: answer.userId, room: roomId },
          {
            $inc: {
              'stats.quizzesAnswered': 1,
              ...(isCorrect ? { 'stats.correctAnswers': 1 } : { 'stats.incorrectAnswers': 1 })
            }
          },
          { upsert: true, new: true }
        );
        await updateStreak(answer.userId, roomId);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = setupSocket; 