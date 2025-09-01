import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export function writeFileSync(path: string, content: string) {
  fs.writeFileSync(path, content, { encoding: 'utf-8' })
}

export function generateJsonFile(outDir: string, name: string) {
  const resolvedJSONPath = path.join(process.cwd(), outDir, `${name}.json`)
  if (!fs.existsSync(resolvedJSONPath)) {
    let data = {}
    if (name === 'pages') {
      data = { pages: [{ path: '' }] }
    }
    writeFileSync(resolvedJSONPath, JSON.stringify(data, null, 2))
  }
}
