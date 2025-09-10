import { ctpClient } from './buildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import 'dotenv/config';

// Create apiRoot from the imported ClientBuilder and include your Project key
const ctApiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CT_PROJECT_KEY ?? '',
});

export { ctApiRoot };
