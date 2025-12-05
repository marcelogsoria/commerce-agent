import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Define the schema for the tool's input.
const getDocumentationToolSchema = z.object({
  input: z
    .string()
    .describe(
      'The query text used to find similar content in the documentation.',
    ),
  limit: z
    .number()
    .optional()
    .describe('Maximum total number of similar content items to return.'),
  crowding: z
    .number()
    .optional()
    .describe(
      'Maximum number of results returned from a single document type.',
    ),
  contentTypes: z
    .array(z.string())
    .optional()
    .describe(
      'Array of types to be returned. Allowed values: `apiType`,`apiEndpoint`,`referenceDocs`,`guidedDocs`,`userDocs`.',
    ),
  products: z
    .array(z.string())
    .optional()
    .describe(
      "Array of product names to filter the search results. Allowed values: ['Composable Commerce', 'Frontend', 'Checkout', 'Connect'].",
    ),
});

// Create the documentation tool.
export const getDocumentationTool = new DynamicStructuredTool({
  name: 'search_commercetools_documentation',
  description:
    'Searches the commercetools documentation to find answers to questions about the platform, API usage, and tool syntax. Use this when you are unsure how to perform a specific action or need to know the correct syntax for a query.',
  schema: getDocumentationToolSchema,
  func: async ({ input, limit, crowding, contentTypes, products }) => {
    try {
      const searchParams = new URLSearchParams({ input });
      if (limit) searchParams.append('limit', limit.toString());
      if (crowding) searchParams.append('crowding', crowding.toString());
      if (contentTypes) {
        contentTypes.forEach((contentType: string) =>
          searchParams.append('contentTypes', contentType),
        );
      }
      if (products) {
        products.forEach((product: string) =>
          searchParams.append('products', product),
        );
      }

      const url = `https://docs.commercetools.com/apis/rest/content/similar-content?${searchParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        return `Error: Failed to fetch documentation. Status: ${response.status} ${response.statusText}`;
      }

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: An unexpected error occurred while fetching documentation: ${error.message}`;
      }
      return 'Error: An unexpected error occurred while fetching documentation.';
    }
  },
});
