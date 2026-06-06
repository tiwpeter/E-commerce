import { readdirSync, writeFileSync } from 'fs'

const base = './src/api/generated'
const dirs = readdirSync(base, { withFileTypes: true })
  .filter(d => d.isDirectory()) // remove && d.name !== 'model'
  .map(d => d.name)

dirs.forEach(dir => {
  const files = readdirSync(`${base}/${dir}`)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => f.replace('.ts', ''))

  const content = files.map(f => `export * from './${f}'`).join('\n') + '\n'
  writeFileSync(`${base}/${dir}/index.ts`, content)
  console.log(`✅ created ${base}/${dir}/index.ts →`, files)
})

writeFileSync(
  `${base}/index.ts`,
  dirs.map(d => `export * from './${d}'`).join('\n') + '\n'
)
console.log(`✅ created ${base}/index.ts`)