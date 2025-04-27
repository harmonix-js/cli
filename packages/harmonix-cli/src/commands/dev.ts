import { defineCommand } from 'citty'
import { createHarmonix } from '@harmonix-js/core'

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
  async run(ctx) {
    process.env.NODE_ENV = 'development'

    await createHarmonix({ rootDir: ctx.args.dir }, { cwd: ctx.args.dir })
  }
})
