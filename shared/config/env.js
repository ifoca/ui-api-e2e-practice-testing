import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Walk up from shared/config/ to the monorepo root to find .env
const rootDir = resolve(fileURLToPath(import.meta.url), '../../../');
dotenv.config({ path: resolve(rootDir, '.env') });

// Export named constants — if a required variable is missing, fail loudly
// at startup rather than silently using undefined later in a test
const required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const config = {
  api: {
    baseUrl: required('API_BASE_URL'),
  },
  client: {
    baseUrl: required('CLIENT_BASE_URL'),
  },
  mongo: {
    uri: required('MONGO_URI'),
    dbName: required('MONGO_DB_NAME'),
  },
  testUsers: {
    customer: {
      email: required('TEST_USER_EMAIL'),
      password: required('TEST_USER_PASSWORD'),
    },
  },
};
