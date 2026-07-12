/**
 * Custom in-memory sliding-window rate limiter middleware.
 * Does not require external database or redis dependencies.
 */
const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  const ipRequests = new Map();

  return (req, res, next) => {
    // Determine the IP address of the request
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    // Filter out timestamps outside the current window
    const requests = ipRequests.get(ip).filter(timestamp => now - timestamp < windowMs);
    requests.push(now);
    ipRequests.set(ip, requests);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - requests.length));

    if (requests.length > limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
