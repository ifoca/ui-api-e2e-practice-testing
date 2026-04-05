import pg from 'pg';
import { readFile, readdir } from 'fs/promises';
import { resolve, join } from 'path';
import { config } from '../../shared/config/env.js';

const { Client } = pg; // Postgres

const runDatabaseTests = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();

  const testDir = resolve('./tests');
  const files = (await readdir(testDir)).filter((f) => f.endsWith('.sql'));

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const sql = await readFile(join(testDir, file), 'utf-8');
    const result = await client.query(sql);

    // Zero rows = test passes, any rows = test fails
    if (result.rows.length === 0) {
      console.log(`  ✓ ${file}`);
      passed++;
    } else {
      console.log(`  ✗ ${file} — ${result.rows.length} failing rows`);
      console.table(result.rows);
      failed++;
    }
  }

  await client.end();

  console.log(`\n${passed} passed, ${failed} failed`);

  // Exit with non-zero code so CI marks the job as failed
  if (failed > 0) process.exit(1);
};

runDatabaseTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
