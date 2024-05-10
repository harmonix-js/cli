import { defineCommand } from 'citty'
import { downloadTemplate } from 'giget'
import { consola } from 'consola'
import { installDependencies, type PackageManagerName } from 'nypm'

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize a new Harmonix project'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: 'harmonix-app'
    }
  },
  async run(ctx) {
    const template = await downloadTemplate('github:harmonix-js/starter', {
      dir: ctx.args.dir,
      cwd: '.'
    })
		const packageManagerOptions: PackageManagerName[] = [
			'bun',
			'npm',
			'pnpm',
			'yarn'
		]
		const selectedPackageManager = await consola.prompt('Wich package manager would you like to use?', {
			type: 'select',
			options: packageManagerOptions
		})

		consola.start('Installing dependencies...')
		try {
			await installDependencies({
				cwd: template.dir,
				packageManager: {
					name: selectedPackageManager,
					command: selectedPackageManager
				}
			})
		} catch (err) {
			consola.error((err as Error).toString())
			process.exit(1)
		}
		consola.success('Installation completed.')
    consola.log(`✨ Harmonix project has been created. Next steps:`)
    consola.log(` › cd ${ctx.args.dir}`)
    consola.log(' › npm run start')
  }
})
