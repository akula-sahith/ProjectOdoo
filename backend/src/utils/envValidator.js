const { AppError } = require('./customErrors');

/**
 * Validates critical environment variables.
 * Throws AppError if validation fails.
 */
const validateEnv = () => {
  const errors = [];

  // 1. Port Validation
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      errors.push(`PORT must be a valid integer between 1 and 65535, got "${process.env.PORT}"`);
    }
  }

  // 2. Database URL Validation
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is missing from environment variables');
  } else if (
    !process.env.DATABASE_URL.startsWith('postgresql://') &&
    !process.env.DATABASE_URL.startsWith('postgres://')
  ) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string (starting with postgresql:// or postgres://)');
  }

  // 3. JWT Secret Validation
  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is missing from environment variables');
  } else if (process.env.JWT_SECRET.trim().length < 8) {
    errors.push('JWT_SECRET must be at least 8 characters long for security');
  }

  // 4. Node Env Validation
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    errors.push(`NODE_ENV must be one of: development, production, test. Got "${process.env.NODE_ENV}"`);
  }

  if (errors.length > 0) {
    console.error('❌ [Configuration Error] Environment variable validation failed:');
    errors.forEach((err) => console.error(`  - ${err}`));
    throw new AppError('Environment variable validation failed', 500, errors);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment configuration validated successfully.');
  }
};

module.exports = validateEnv;
