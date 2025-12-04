import * as dotenv from 'dotenv';
import * as path from 'path';

const testEnvPath = path.resolve(__dirname, '../.env.test');

// Load environment variables from .env.test if it exists.
// dotenv will not override any environment variables that have already been set.
dotenv.config({
  path: testEnvPath,
});

// Set default mock values for the environment variables if they are not already set.
// This ensures that the tests can run in environments where the .env.test file is not present,
// such as in the GitHub Actions CI environment.
process.env.CT_CLIENT_ID = process.env.CT_CLIENT_ID ?? 'test';
process.env.CT_CLIENT_SECRET = process.env.CT_CLIENT_SECRET ?? 'test';
process.env.CT_PROJECT_KEY = process.env.CT_PROJECT_KEY ?? 'test';
process.env.CT_AUTH_URL = process.env.CT_AUTH_URL ?? 'https://auth.example.com';
process.env.CT_API_URL = process.env.CT_API_URL ?? 'https://api.example.com';
process.env.TWILIO_ACCOUNT_SID =
  process.env.TWILIO_ACCOUNT_SID ?? 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? 'test';
process.env.TWILIO_NUMBER = process.env.TWILIO_NUMBER ?? 'test';

