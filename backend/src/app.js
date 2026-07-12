const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import custom infrastructure middlewares
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const sanitizer = require('./middleware/sanitizer');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logger middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(requestLogger);

// Global Rate Limiter for all API routes (150 requests per 15 minutes window)
app.use('/api', rateLimiter(150, 15 * 60 * 1000));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input sanitization against XSS and Prototype Pollution
app.use(sanitizer);

// API Routes
const routes = require('./routes');
const modulesRouter = require('./modules');

app.use('/api', routes);
app.use('/api', modulesRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AssetFlow Backend Running'
  });
});

// Centralized 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
