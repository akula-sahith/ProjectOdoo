/**
 * Custom request logging middleware to track route duration and response codes.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logString = `[API Log] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Time: ${duration}ms`;
    
    if (res.statusCode >= 500) {
      console.error(`🔴 ${logString}`);
    } else if (res.statusCode >= 400) {
      console.warn(`🟡 ${logString}`);
    } else {
      console.log(`🟢 ${logString}`);
    }
  });

  next();
};

module.exports = requestLogger;
