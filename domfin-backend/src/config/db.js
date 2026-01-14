// domfin-backend/src/config/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Neon-friendly settings
  max: 10,                        // Max connections
  idleTimeoutMillis: 30000,       // Close idle after 30s
  connectionTimeoutMillis: 10000, // Fail fast if can't connect
  maxLifetimeSeconds: 60,         // Recycle connections
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;