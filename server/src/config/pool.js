import { Pool } from 'pg';
import 'dotenv/config.js';

// This should be read from an environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default pool