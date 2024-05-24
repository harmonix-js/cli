import { defineCommand } from 'citty'
import fs from 'fs-extra'
import { resolve, relative } from 'pathe'
import consola from 'consola'
import { colors } from 'consola/utils'
import prettyBytes from 'pretty-bytes'
import { gzipSize } from 'gzip-size'

export default defineCommand({
  meta: {
    name: 'build',
    description: 'Build the bot for production'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: '.'
    }
  },
  async run(ctx) {
    const content =
      '#!/usr/bin/env node\n' +
      "import { createHarmonix } from '@harmonix-js/core'\n" +
      "process.env.NODE_ENV = 'production'\n" +
      "createHarmonix({ rootDir: '.' }, { cwd: '.' })"
    const outputDir = resolve(ctx.args.dir, './.output')

    consola.info('Building the bot')
    await fs.ensureDir(outputDir)
    await fs.emptyDir(outputDir)
    await fs.writeFile(resolve(outputDir, 'index.mjs'), content)
    consola.success('Harmonix Bot built')
    const src = await fs.readFile(resolve(outputDir, 'index.mjs'))
    const gsize = await gzipSize(src)

    consola.log(
      colors.gray(
        `  └─ ${relative(process.cwd(), resolve(outputDir, 'index.mjs'))} (${prettyBytes(src.byteLength)}) (${prettyBytes(gsize)} gzip)`
      )
    )
    consola.log(
      `${colors.cyan('Σ Total size:')} ${prettyBytes(src.byteLength)} (${prettyBytes(gsize)} gzip)`
    )
    consola.success(
      `You can deploy this build using \`node ${relative(process.cwd(), resolve(outputDir, 'index.mjs'))}\``
    )
  }
})
