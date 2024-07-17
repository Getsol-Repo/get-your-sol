import { readdirSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

export function cleanNonEssentials(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-clean-non-essentials',
    configResolved(_config) {
      // console.log('configResolved')
      config = _config
    },
    writeBundle() {
      const { outDir } = config.build
      deleteFilesRecursively(`${outDir}/assets`, ['.tsx', '.html', '.ts', '.less', '.yaml', '.txt'])
    },
  }
}

function deleteFilesRecursively(dir: string, extensions: string[]) {
  const files = readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const fileStat = statSync(filePath)
    if (fileStat.isDirectory()) {
      deleteFilesRecursively(filePath, extensions)
    } else {
      const ext = path.extname(file)
      if (extensions.includes(ext)) {
        console.log('Deleting:', filePath)
        unlinkSync(filePath)
      }
    }
  })
}
