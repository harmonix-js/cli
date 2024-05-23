import { defineCommand } from 'citty'
import { createDevHarmonix } from '@harmonix-js/core'

export default defineCommand({
  meta: {
    name: 'dev',
    description: 'Run Harmonix in development mode'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: '.'
    }
  },
  async run(context) {
    await createDevHarmonix(
      { rootDir: context.args.dir },
      { cwd: context.args.dir }
    )
  }
})
