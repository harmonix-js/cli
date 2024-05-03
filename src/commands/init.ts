import { defineCommand } from 'citty'
import { downloadTemplate } from 'giget'
import { consola } from 'consola'

export default defineCommand({
	meta: {
		name: 'init',
		description: 'Initialize a new Harmony project'
	},
	args: {
		dir: {
			type: 'positional',
			description: 'Project directory',
			default: 'harmony-app'
		}
	},
	async run(ctx) {
		await downloadTemplate('github:harmony-ts/starter', {
			dir: ctx.args.dir,
			cwd: '.'
		})

		consola.log(`✨ Harmony project has been created. Next steps:`)
		consola.log(` › cd ${ctx.args.dir}`)
		consola.log(' › npm install')
		consola.log(' › npm run dev')
	}
})