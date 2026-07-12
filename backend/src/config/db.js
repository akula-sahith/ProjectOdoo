const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initialize the database connection pool using pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Initialize the Prisma driver adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the PostgreSQL driver adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
