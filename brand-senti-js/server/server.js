// server.js – Express entry point with DB connection & Socket.IO
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env variables (project root .env)
dotenv.config({ path: require('path').resolve(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// ----- MongoDB connection -----
const connectDB = require('./config/db');
connectDB();

// ----- Routes -----
const sentimentRoute = require('./routes/sentiment');
const dashboardRoute = require('./routes/dashboard');
const apiRoute = require('./routes/api');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

app.use('/api/sentiment', sentimentRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api', apiRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/v1', require('./routes/v1'));

// Health check
app.get('/', (req, res) => {
  res.send('BrandSenti API is running...');
});

// ----- Socket.IO setup -----
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware to authenticate socket connections using JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  const jwt = require('jsonwebtoken');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload; // attach user payload
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User ${socket.user?.id || 'unknown'} connected via Socket.IO`);
  // Example: emit a welcome event
  socket.emit('welcome', { message: 'Connected to BrandSenti real‑time service' });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });
});

// Export io for use in other modules (e.g., services emitting events)
module.exports = { io };

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

