import { defineConfig } from 'orval';

export default defineConfig({
  shopApi: {
    input: {
      target: 'http://localhost:5000/api-docs.json',
    },
    output: {
      mode: 'tags-split',          // แยกไฟล์ตาม tag เช่น products.ts, categories.ts
      target: './src/api/generated',         // hooks + service functions ไปที่นี่
      schemas: './src/api/generated/model',  // TypeScript types ไปที่นี่
      indexFiles: true,
      client: 'react-query',       // generate TanStack Query hooks
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/axios.ts',  // ✅ แก้จาก ./app/lib/axios.ts
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