const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://todo-app-flame-gamma-50.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/todos', require('./routes/todos'));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server on port ${process.env.PORT}`);
});