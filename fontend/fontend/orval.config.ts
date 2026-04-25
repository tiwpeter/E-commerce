import { defineConfig } from "orval";

export default defineConfig({
  // "demoApi" คือชื่อ output group (ตั้งเองได้)
  demoApi: {
    input: {
      // ชี้ไปที่ swagger.json ของ backend
      target: "http://localhost:5000/api-docs.json",
    },
    output: {
      // โหมด "react-query" = Orval จะ generate TanStack Query hooks ให้อัตโนมัติ
      mode: "tags-split",          // แยกไฟล์ตาม tag (Todos, Users)
      target: "./src/api",         // โฟลเดอร์ output
      schemas: "./src/api/model",  // โฟลเดอร์เก็บ TypeScript types
      client: "react-query",       // ใช้ TanStack Query
      httpClient: "axios",         // ใช้ axios เป็น HTTP client
      override: {
        mutator: {
          // custom axios instance (ตั้ง baseURL ที่นี่)
          path: "./app/lib/axios.ts",,
          name: "customAxios",
        },
        query: {
          useQuery: true,
          useMutation: true,
          // signal สำหรับ abort request
          signal: true,
        },
      },
    },
  },
});
