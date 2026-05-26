import { Pool } from 'pg';
import 'dotenv/config.js';

// This should be read from an environment variable
const pool = new Pool({
  connectionString: `postgresql://sub-prime:omgitspsql88@localhost:5432/dating`
});

export default pool