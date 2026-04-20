// src/openapi/registry.ts
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';


extendZodWithOpenApi(z); // ← เพิ่มตรงนี้

export const registry = new OpenAPIRegistry();

