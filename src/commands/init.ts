import { defineCommand } from 'citty'
import { downloadTemplate } from 'giget'
import { consola } from 'consola'

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
		await downloadTemplate('github:harmonix-js/starter', {
			dir: ctx.args.dir,
			cwd: '.'
		})

		consola.log(`✨ Harmonix project has been created. Next steps:`)
		consola.log(` › cd ${ctx.args.dir}`)
		consola.log(' › npm install')
		consola.log(' › npm run dev')
	}
})