const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/posts', require('./src/routes/postRoutes'));


app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api') && !req.originalUrl.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  } else {
    next();
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
