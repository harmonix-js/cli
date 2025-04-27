import { defineCommand } from 'citty'
import consola from 'consola'
import { detectPackageManager, addDependency } from 'nypm'

export default defineCommand({
  meta: {
    name: 'update',
    description: 'Update the Harmonix core and CLI to the latest version'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: '.'
    }
  },
  async run(ctx) {
    consola.start('Updating dependencies...')
    try {
      const packageManager = await detectPackageManager(ctx.args.dir)

      await addDependency('@harmonix-js/core@latest', {
        cwd: ctx.args.dir,
        packageManager,
        silent: true
      })
      await addDependency('@harmonix-js/cli@latest', {
        cwd: ctx.args.dir,
        packageManager,
        dev: true,
        silent: true
      })
      consola.log(`✨ Harmonix core and CLI have been updated.`)
    } catch (err) {
      consola.error((err as Error).toString())
      process.exit(1)
    }
  }
})
