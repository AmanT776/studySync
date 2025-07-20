require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


app.use(cors({
  origin: [
    "http://localhost:5174", 
    "https://study-sync-qim8jis70-amanuel-tesfayes-projects.vercel.app"
  ],
    credentials: true}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const flashcardRoutes = require('./routes/flashcards');
const quizRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const setupSocket = require('./socket');
setupSocket(io);

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);


app.get('/', (req, res) => {
  res.send('StudSync API is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 