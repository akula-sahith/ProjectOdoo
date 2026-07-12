/**
 * Recursive sanitizer to escape HTML characters and prevent Prototype Pollution.
 */
const sanitizeString = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return sanitizeString(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(val)) {
      // Prevent Prototype Pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleanObj[key] = sanitizeValue(val[key]);
    }
    return cleanObj;
  }
  return val;
};

const sanitizer = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = sanitizer;
