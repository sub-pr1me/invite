import { Pool } from 'pg';
import 'dotenv/config.js';

// This should be read from an environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default pool

// postgres://
// USER - adb9b9e22d6fac5d7bf8911552b2e58710b26bc1e1b4f40fc74daa22a61c8714
// PASSWORD - sk_RdV30ceqJp8ctIHWkgpLy
// HOST - db.prisma.io
// PORT - 5432
// DATABASE - postgres?sslmode=require