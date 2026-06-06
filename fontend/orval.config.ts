import { defineConfig } from 'orval';

export default defineConfig({
  shopApi: {
    input: {
      target: process.env.ORVAL_API_SPEC_URL ?? 'http://localhost:5000/api-docs.json',
    },
    output: {
      mode: 'tags-split',          // split files by tag, like products.ts, categories.ts
      target: './src/api/generated',         // hooks + service functions go here
      schemas: './src/api/generated/model',  // TypeScript types go here
      indexFiles: true,
      client: 'react-query',       // generate TanStack Query hooks
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/axios.ts',  // ✅ fixed path from ./app/lib/axios.ts
          name: 'customAxios',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});