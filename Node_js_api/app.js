const express = require('express');
const app = express();
const port = 5000;
const router = require('./routes'); // Ensure this is the correct path
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const http = require('http');
const manageQuizModel = require("./models/quiz.model");

// Socket.IO setup
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// Middleware
app.use(express.json());
app.use(cors());


app.use('/api', router);




// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI2 || 'mongodb+srv://Contas:nuouP4MyDhH0q3E4@cluster0.gkkofhc.mongodb.net/quizgame', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Socket.IO functionality
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle quiz creation, deletion, etc.
  socket.on('create-question', async (questionData) => {
      try {
          // Save the question in MongoDB
          const newQuestion = await manageQuizModel.create(questionData);
          io.emit('question-added', newQuestion);  // Broadcast to all clients
      } catch (err) {
          console.error('Error creating question:', err);
          socket.emit('error', 'Failed to create question');
      }
  });

  socket.on('update-question', async (updatedData) => {
      try {
          const updatedQuestion = await manageQuizModel.findByIdAndUpdate(updatedData._id, updatedData, { new: true });
          io.emit('question-updated', updatedQuestion);  // Broadcast to all clients
      } catch (err) {
          console.error('Error updating question:', err);
          socket.emit('error', 'Failed to update question');
      }
  });

  socket.on('delete-question', async (questionId) => {
      try {
          await manageQuizModel.findByIdAndDelete(questionId);
          io.emit('question-deleted', questionId);  // Broadcast to all clients
      } catch (err) {
          console.error('Error deleting question:', err);
          socket.emit('error', 'Failed to delete question');
      }
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
