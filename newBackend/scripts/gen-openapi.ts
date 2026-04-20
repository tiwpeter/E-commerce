// scripts/gen-openapi.ts
// scripts/gen-openapi.ts
import { getDMMF } from '@prisma/internals';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function main() {
  const schema = readFileSync('./prisma/schema.prisma', 'utf-8');
  const dmmf = await getDMMF({ datamodel: schema });

  const routesImports: string[] = [];

  for (const model of dmmf.datamodel.models) {
    const name = model.name;
    const lower = name.toLowerCase();
    const dir = `./src/generated/${name}`;

    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${name}Router.openapi.ts`), genFile(name, lower));
    routesImports.push(`import '../../generated/${name}/${name}Router.openapi';`);
  }

  // ✅ สร้างโฟลเดอร์ก่อนเขียนไฟล์
  mkdirSync('./src/openapi/routes', { recursive: true });
  writeFileSync('./src/openapi/routes/index.ts', routesImports.join('\n'));

  console.log(`✅ Generated ${dmmf.datamodel.models.length} openapi files`);
}

function genFile(name: string, lower: string) {
  return `
import { registry } from '../../openapi/registry';
import {
  ${name}Schema,
  ${name}CreateInputSchema,
  ${name}UpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/${lower}/{id}',
  tags: ['${name}'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ${name}Schema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/${lower}',
  tags: ['${name}'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(${name}Schema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/${lower}',
  tags: ['${name}'],
  request: {
    body: { content: { 'application/json': { schema: ${name}CreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ${name}Schema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/${lower}/{id}',
  tags: ['${name}'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ${name}UpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ${name}Schema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/${lower}/{id}',
  tags: ['${name}'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});
`.trim();
}

main();