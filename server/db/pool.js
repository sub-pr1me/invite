import { Pool } from 'pg';
import 'dotenv/config.js';

// This should be read from an environment variable
const pool = new Pool({
  connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`
});

export default pool