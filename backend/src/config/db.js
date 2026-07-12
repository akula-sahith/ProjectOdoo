const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

console.log(process.env.DATABASE_URL)

// Initialize the database connection pool using pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully.");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
  }
})();

// Initialize the Prisma driver adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the PostgreSQL driver adapter
const prisma = new PrismaClient({ adapter });

// Attach the pool to the prisma instance so standalone scripts can close it
prisma.pool = pool;

module.exports = prisma;
